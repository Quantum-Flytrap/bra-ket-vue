<template>
  <div class="matrix-viewer">
    <div>
      <svg
        :class="quantumMatrixClass"
        :width="columnSize + (1.5 + coordNamesOut.length) * size"
        :height="rowSize + (3.5 + coordNamesIn.length) * size"
      >
        <g :transform="`translate(${(coordNamesOut.length + 1) * size}, ${1 * size})`">
          <matrix-labels
            :size="size"
            axis-label="input"
            location="top"
            :dark-mode="darkMode"
            :coordNames="coordNamesIn"
            :selected="selectedIn"
          />
        </g>
        <g :transform="`translate(${size}, ${rowSize + (1 + coordNamesIn.length) * size})`">
          <matrix-dimensions
            :dimensionNamesNumbered="dimensionNamesOutNumbered"
            :dark-mode="darkMode"
            location="left"
            @swap-dimensions="swapDimensions($event)"
          />
        </g>
        <g :transform="`translate(${1 * size}, ${(coordNamesIn.length + 1) * size})`">
          <matrix-labels
            :size="size"
            axis-label="output"
            location="left"
            :dark-mode="darkMode"
            :coordNames="coordNamesOut"
            :selected="selectedOut"
          />
        </g>
        <g :transform="`translate(${(coordNamesOut.length + 1) * size}, ${(coordNamesIn.length + 1) * size})`">
          <rect
            v-for="d in allTileLocations"
            :key="`entry-tile-${d.i}-${d.j}`"
            class="entry-tile"
            :x="scale(d.j)"
            :y="scale(d.i)"
            :width="size"
            :height="size"
            @mouseover="tileMouseOver(d)"
          />
          <rect
            class="entry-boarder"
            :x="0"
            :y="0"
            :width="columnSize"
            :height="rowSize"
          />
          <rect
            v-if="selectedEntry"
            class="selected-column"
            :x="scale(selectedEntry.j)"
            :y="0"
            :width="size"
            :height="rowSize"
          />
          <circle
            v-for="d in matrixElements"
            :key="`circle-${d.i}-${d.j}-${d.re}-${d.im}`"
            class="tile-value"
            :cx="scale(d.j + 0.5)"
            :cy="scale(d.i + 0.5)"
            :r="rScale(d.re, d.im)"
            :style="{ fill: generateColor(d.re, d.im) }"
            @mouseover="tileMouseOver(d)"
          />
        </g>
      </svg>
    </div>
    <div
      v-if="showLegend"
      :class="legendContainer"
    >
      <div class="matrix-legend">
        <div class="legend-text">
          change basis
        </div>
        <div
          v-for="(index, bases) in allBases"
          :key="`basis-${bases.name}`"
        >
          <span
            v-if="bases.name == 'polarization'"
          >
            <options-group-svg
              v-if="dimensionNamesOut.indexOf(bases.name) > -1"
              :key="`options-group-basis-${bases.name}`"
              :options="bases.availableBases"
              :dark-mode="darkMode"
              :selected-option="bases.selected"
              @selected="changeBasis(bases, $event)"
            />
          </span>
          <span
            v-else
          >
            <options-group
              v-if="dimensionNamesOut.indexOf(bases.name) > -1"
              :key="`options-group-basis-${bases.name}`"
              :options="bases.availableBases"
              :dark-mode="darkMode"
              :selected-option="bases.selected"
              @selected="changeBasis(index, $event)"
            />
          </span>
        </div>
      </div>
      <div class="matrix-legend">
        <complex-legend
          :re="selectedEntry.re"
          :im="selectedEntry.im"
          :dark-mode="darkMode"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  ref,
} from 'vue';
import {
  Vector, VectorEntry, Operator, helpers, Cx, Dimension,
} from 'quantum-tensors';
import { colorComplexPhaseToHue } from '@/lib-components/colors';
import { range } from '@/lib-components/utils';
import MatrixLabels from '@/lib-components/matrix-labels.vue';
import MatrixDimensions from '@/lib-components/matrix-dimensions.vue';
import OptionsGroup from '@/lib-components/options-group.vue';
import OptionsGroupSvg from '@/lib-components/options-group-svg.vue';
import ComplexLegend from '@/lib-components/complex-legend.vue';

interface IMatrixElement {
  i: number
  j: number
  re: number
  im: number
}

/**
 * When there are more dimensions with the same name, adding numbers to them,
 * e.g. ['qubit', 'polarization', 'spin', 'qubit'] -> ['qubit 1', 'polarization', 'spin', 'qubit 2']
 */
function numberDimNames(dimNames: string[]): string[] {
  const counter = new Map<string, number>();
  return dimNames
    .map((name): [string, number] => {
      const count = 1 + (counter.get(name) || 0);
      counter.set(name, count);
      return [name, count];
    })
    .map(([name, count]) => (counter.get(name) === 1 ? name : `${name} ${count}`));
}

export default defineComponent({
  name: 'MatrixViewer',
  components: {
    MatrixLabels,
    MatrixDimensions,
    OptionsGroup,
    OptionsGroupSvg,
    ComplexLegend,
  },
  props: {
    size: { type: Number, default: 40 },
    operator: { type: Object as PropType<Operator>, required: true },
    darkMode: { type: Boolean, default: true },
    showLegend: { type: Boolean, default: true },
  },
  emits: ['column-mouseover'],
  setup(props, { emit }) {
    const allBases = ref([
      { name: 'polarization', availableBases: ['HV', 'DA', 'LR'], selected: 'HV' },
      { name: 'spin', availableBases: ['spin-x', 'spin-y', 'spin-z'], selected: 'spin-z' },
      { name: 'qubit', availableBases: ['01', '+-', '+i-i'], selected: '01' },
    ]);

    const permuteOrder = ref(range(props.operator.dimensionsOut.length));
    const innerOperator = computed(() => {
      const op = props.operator;
      const permuteBoth = (op.dimensionsOut.length === op.dimensionsIn.length)
        && op.dimensionsOut
          .every((d, di) => d.isEqual(op.dimensionsIn[di]));

      const permuted = permuteBoth ? op.permute(permuteOrder.value) : op.permuteDimsOut(permuteOrder.value);
      const bases = allBases.value;
      return permuted
        .toBasisAll('polarization', bases[0].selected)
        .toBasisAll('spin', bases[1].selected)
        .toBasisAll('qubit', bases[2].selected);
    });

    type AbsoluteCoord = Record<string, number>

    function fromAbsoluteCoord(coord: AbsoluteCoord, dims: Dimension[]): number | null {
      if (Object.entries(coord).length !== dims.length) return null;
      const out = dims.map((dim) => coord[dim.name]);
      if (out.some((n) => n == null)) return null;
      return helpers.coordsToIndex(out, dims.map((d) => d.size));
    }

    function toAbsoluteCoord(idx: number, dims: Dimension[]): AbsoluteCoord {
      const coord = helpers.coordsFromIndex(idx, dims.map((d) => d.size));
      const abs: AbsoluteCoord = {};
      for (let i = 0; i < coord.length; i += 1) {
        abs[dims[i].name] = coord[i];
      }
      return abs;
    }

    const selection = ref<[AbsoluteCoord, AbsoluteCoord] | null>(null);


    const matrixElements = computed((): IMatrixElement[] => innerOperator.value
      .toIndexIndexValues()
      .map((entry) => ({
        i: entry.i,
        j: entry.j,
        re: entry.v.re,
        im: entry.v.im,
      })));

    const defaultEntry = {
      i: -1,
      j: -1,
      re: 0,
      im: 0,
    };

    const selectedEntry = computed((): IMatrixElement => {
      const op = innerOperator.value;
      if (selection.value == null) return defaultEntry;

      const [absCoordOut, absCoordIn] = selection.value;
      const coordOut = fromAbsoluteCoord(absCoordOut, op.dimensionsOut);
      const coordIn = fromAbsoluteCoord(absCoordIn, op.dimensionsIn);
      if (coordIn == null || coordOut == null) return defaultEntry;
      return matrixElements.value.find(({ i, j }) => i === coordOut && j === coordIn)
        || {
          i: coordOut, j: coordIn, re: 0, im: 0,
        };
    });

    const coordNamesIn = computed(() => innerOperator.value.coordNamesIn);

    const coordNamesOut = computed(() => innerOperator.value.coordNamesOut);

    const dimensionNamesOut = computed(() => innerOperator.value.dimensionsOut.map((dim) => dim.name));

    const selectedIn = computed((): number[] => {
      if (selectedEntry.value == null) return [];
      return [selectedEntry.value.j];
    });

    const selectedOut = computed((): number[] => {
      if (selectedEntry.value == null) return [];
      const { j } = selectedEntry.value;
      return matrixElements.value
        .filter((d) => d.j === j)
        .map((d) => d.i);
    });

    /**
     * Width
     */
    const columnSize = computed((): number => props.size * innerOperator.value.totalSizeIn);

    /**
     * Height
     */
    const rowSize = computed((): number => props.size * innerOperator.value.totalSizeOut);

    const allTileLocations = computed((): { i: number; j: number }[] => range(innerOperator.value.totalSizeOut)
      .flatMap((i) => range(innerOperator.value.totalSizeIn).map((j) => ({
        i, j, re: 0, im: 0,
      }))));

    const legendContainer = computed((): string => (
      props.darkMode
        ? 'legend-container-dark'
        : 'legend-container-bright'));

    const quantumMatrixClass = computed((): string => (
      props.darkMode
        ? 'quantum-matrix-dark'
        : 'quantum-matrix-bright'));

    const dimensionNamesOutNumbered = computed(() => numberDimNames(innerOperator.value.namesOut));

    function scale(i: number): number {
      return i * props.size;
    }

    function generateColor(re: number, im: number): string {
      return colorComplexPhaseToHue(re, im, 100, 50);
    }

    function rScale(re: number, im = 0): number {
      return 0.46 * props.size * Math.sqrt(re ** 2 + im ** 2);
    }

    /**
     * Emit unit vector for input
     */
    function tileMouseOver(tile: IMatrixElement): void {
      const coordOut = toAbsoluteCoord(tile.i, innerOperator.value.dimensionsOut);
      const coordIn = toAbsoluteCoord(tile.j, innerOperator.value.dimensionsIn);
      selection.value = [coordOut, coordIn];

      const coords = helpers.coordsFromIndex(tile.j, innerOperator.value.sizeIn);
      const vec = new Vector([new VectorEntry(coords, Cx(1))], [...innerOperator.value.dimensionsIn]);
      emit('column-mouseover', vec);
    }

    /**
     * @todo Make all dimension changes within this component.
     * (After using Operator rather than passed parameteres.)
     */
    function swapDimensions(i: number): void {
      const newOrder = [...permuteOrder.value];
      newOrder[i] += 1;
      newOrder[i + 1] -= 1;
      permuteOrder.value = newOrder;
    }

    function changeBasis(index: number, basis: string) {
      allBases.value[index].selected = basis;
    }

    return {
      allBases,
      innerOperator,
      selectedEntry,
      matrixElements,
      coordNamesIn,
      coordNamesOut,
      dimensionNamesOut,
      selectedIn,
      selectedOut,
      columnSize,
      rowSize,
      allTileLocations,
      legendContainer,
      quantumMatrixClass,
      dimensionNamesOutNumbered,
      scale,
      generateColor,
      rScale,
      tileMouseOver,
      swapDimensions,
      changeBasis,
    };
  },
});
</script>

<style scoped lang="scss">
@import "../style-variables.scss";

.matrix-viewer {
  display: flex;
  font-family: $mainFont;
}

.legend-container-dark, .legend-container-bright {
  margin-top: 40px;
    & .matrix-legend {
    padding-top: 10px;
    padding-bottom: 30px;
    & .legend-text {
      font-size: $fontSizeDefault;
      text-transform: uppercase;
      font-weight: 300;
      padding-bottom: 10px;
    }
  }
}

.legend-container-dark {
    & .matrix-legend {
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    & .legend-text {
      color: rgba(255, 255, 255, 0.7);
    }
  }
}

.legend-container-bright {
    & .matrix-legend {
    border-top: 1px solid rgba(0, 0, 0, 0.3);
    & .legend-text {
      color: rgba(0, 0, 0, 0.9);
    }
  }
}

.quantum-matrix-dark, .quantum-matrix-bright {
  display: inline-block;
  & .label {
    font-size: $fontSizeDefault;
    text-anchor: middle;
    cursor: default;
    text-transform: uppercase;
    font-weight: 300;
  }
  & .selected-column {
    stroke-width: 1px;
  }
  & .entry-tile {
    stroke-width: 1px;
  }
  & .entry-boarder {
    fill: none;
    stroke-width: 1px;
  }
  & .tile-value {
    cursor: pointer;
  }
  & .tile-value:hover {
    stroke-width: 2px;
  }
  & .swap-label,
  & .dimension-label {
    font-size: $fontSizeDefault;
    text-anchor: middle;
    cursor: default;
    text-transform: uppercase;
    font-weight: 300;
  }
}

.quantum-matrix-dark {
  & .label {
    fill: rgba(255, 255, 255, 0.5);
  }
  & .selected-column {
    fill: rgba(255, 255, 255, 0.1);
    stroke: #ffffff;
  }
  & .entry-tile {
    fill: rgba(0, 0, 0, 0);
    stroke: rgba(255, 255, 255, 0.1);
  }
  & .entry-boarder {
    stroke: #fff;
  }
  & .tile-value:hover {
    stroke: rgb(255, 255, 255);
  }
  & .swap-label,
  & .dimension-label {
    fill: rgba(255, 255, 255, 0.5);
  }
}

.quantum-matrix-bright {
  & .label {
    fill: rgba(0, 0, 0, 0.6);
  }
  & .selected-column {
    fill: rgba(0, 0, 0, 0.1);
    stroke: #000;
  }
  & .entry-tile {
    fill: rgba(255, 255, 255, 0);
    stroke: rgba(0, 0, 0, 0.1);
  }
  & .entry-boarder {
    stroke: rgb(0, 0, 0);
  }
  & .tile-value:hover {
    stroke: rgb(255, 255, 255);
  }
  & .swap-label,
  & .dimension-label {
    fill: rgba(0, 0, 0, 0.6);
  }
}

</style>
