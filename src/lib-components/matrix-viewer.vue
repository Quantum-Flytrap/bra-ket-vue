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
            @swapDimensions="swapDimensions($event)"
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
            v-if="selectedEntry.j > -1"
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
          v-for="bases in allBases"
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
              @selected="changeBasis(bases, $event)"
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
import Vue from 'vue';
import {
  Vector, VectorEntry, Operator, helpers, Cx,
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

interface IBases {
  name: string
  availableBases: string[]
  selected: string
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

export default Vue.extend({
  components: {
    MatrixLabels,
    MatrixDimensions,
    OptionsGroup,
    OptionsGroupSvg,
    ComplexLegend,
  },
  props: {
    size: {
      type: Number,
      default: 40,
    },
    operatorRaw: {
      type: Object as () => Operator,
      required: true,
    },
    darkMode: {
      type: Boolean,
      default: true,
    },
    showLegend: {
      type: Boolean,
      default: true,
    },
  },
  data(): {
    operator: Operator, allBases: IBases[], selectedEntry: IMatrixElement, dimensionNamesOutNumbered: string[]
    } {
    return {
      operator: this.operatorRaw,
      allBases: [
        { name: 'polarization', availableBases: ['HV', 'DA', 'LR'], selected: 'HV' },
        { name: 'spin', availableBases: ['spin-x', 'spin-y', 'spin-z'], selected: 'spin-z' },
        { name: 'qubit', availableBases: ['01', '+-', '+i-i'], selected: '01' },
      ],
      selectedEntry: {
        i: -1, j: -1, re: 0, im: 0,
      },
      dimensionNamesOutNumbered: numberDimNames(this.operatorRaw.namesOut),
    };
  },
  computed: {
    matrixElements(): IMatrixElement[] {
      return this.operator
        .toIndexIndexValues()
        .map((entry) => ({
          i: entry.i,
          j: entry.j,
          re: entry.v.re,
          im: entry.v.im,
        }));
    },

    coordNamesIn(): string[][] {
      return this.operator.coordNamesIn;
    },

    coordNamesOut(): string[][] {
      return this.operator.coordNamesOut;
    },

    dimensionNamesOut(): string[] {
      return this.operator.dimensionsOut.map((dim) => dim.name);
    },

    selectedIn(): number[] {
      return [this.selectedEntry.j];
    },

    selectedOut(): number[] {
      return this.matrixElements
        .filter((d) => d.j === this.selectedEntry.j)
        .map((d) => d.i);
    },

    /**
     * Width
     */
    columnSize(): number {
      return this.size * this.operator.totalSizeIn;
    },

    /**
     * Height
     */
    rowSize(): number {
      return this.size * this.operator.totalSizeOut;
    },

    allTileLocations(): { i: number; j: number }[] {
      return range(this.operator.totalSizeOut)
        .flatMap((i) => range(this.operator.totalSizeIn).map((j) => ({
          i, j, re: 0, im: 0,
        })));
    },

    legendContainer(): string {
      return this.darkMode ? 'legend-container-dark' : 'legend-container-bright';
    },

    quantumMatrixClass(): string {
      return this.darkMode ? 'quantum-matrix-dark' : 'quantum-matrix-bright';
    },
  },
  methods: {
    scale(i: number): number {
      return i * this.size;
    },

    generateColor(re: number, im: number): string {
      return colorComplexPhaseToHue(re, im, 100, 50);
    },

    rScale(re: number, im = 0): number {
      return 0.46 * this.size * Math.sqrt(re ** 2 + im ** 2);
    },

    /**
     * Emit unit vector for input
     */
    tileMouseOver(tile: IMatrixElement): void {
      this.selectedEntry = tile;
      const coords = helpers.coordsFromIndex(tile.j, this.operator.sizeIn);
      const vec = new Vector([new VectorEntry(coords, Cx(1))], [...this.operator.dimensionsIn]);
      this.$emit('columnMouseover', vec);
    },

    /**
     * @todo Make all dimension changes within this component.
     * (After using Operator rather than passed parameteres.)
     */
    swapDimensions(i: number): void {
      const both = (this.operatorRaw.dimensionsOut.length === this.operatorRaw.dimensionsIn.length)
        && this.operatorRaw.dimensionsOut
          .map((d, di) => d.isEqual(this.operatorRaw.dimensionsIn[di]))
          .reduce((a, b) => a && b, true);
      const newOrder = range(this.operator.dimensionsOut.length);
      newOrder[i] += 1;
      newOrder[i + 1] -= 1;
      if (both) {
        if (this.selectedEntry.j >= 0) {
          const oldSelectedCoords = helpers.coordsFromIndex(this.selectedEntry.j, this.operator.sizeIn);
          this.operator = this.operator.permute(newOrder);
          const newSelectedCoords = range(this.operator.dimensionsIn.length).map((k) => oldSelectedCoords[newOrder[k]]);
          this.selectedEntry.j = helpers.coordsToIndex(newSelectedCoords, this.operator.sizeIn);
        } else {
          this.operator = this.operator.permute(newOrder);
        }
      } else {
        // console.log('perm out', newOrder);
        // console.log('perm in', range(this.operator.dimensionsIn.length));
        this.operator = this.operator.permuteDimsOut(newOrder);
      }

      // for labels
      const a = this.dimensionNamesOutNumbered[i];
      const b = this.dimensionNamesOutNumbered[i + 1];
      Vue.set(this.dimensionNamesOutNumbered, i, b);
      Vue.set(this.dimensionNamesOutNumbered, i + 1, a);
    },

    changeBasis(bases: IBases, basis: string) {
      // eslint-disable-next-line no-param-reassign
      bases.selected = basis;
      this.selectedEntry = {
        i: -1, j: -1, re: 0, im: 0,
      };
      this.operator = this.operator.toBasisAll(bases.name, basis);
    },

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
