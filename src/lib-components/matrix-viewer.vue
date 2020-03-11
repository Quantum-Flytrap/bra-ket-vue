<template>
  <div class="matrix-viewer">
    <div>
      <svg
        class="quantum-matrix"
        :width="columnSize + (1.5 + coordNamesIn.length) * size"
        :height="rowSize + (4.5 + coordNamesOut.length) * size"
      >
        <g :transform="`translate(${(coordNamesOut.length + 1) * size}, ${1 * size})`">
          <matrix-labels
            :size="size"
            axis-label="input"
            location="top"
            :coordNames="coordNamesIn"
            :selected="selectedIn"
          />
        </g>
        <g :transform="`translate(${size}, ${rowSize + (1 + coordNamesOut.length) * size})`">
          <matrix-dimensions
            :dimensionNames="dimensionNamesOut"
            location="left"
            @swapDimensions="swapDimensions($event)"
          />
        </g>
        <g :transform="`translate(${1 * size}, ${(coordNamesIn.length + 1) * size})`">
          <matrix-labels
            :size="size"
            axis-label="output"
            location="left"
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
            :height="columnSize"
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
    <div class="legend-container">
      <div class="matrix-legend">
        <div class="legend-text">
          base change
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
  },
  data(): { operator: Operator, allBases: IBases[], selectedEntry: IMatrixElement} {
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

    columnSize(): number {
      return this.size * this.operator.totalSizeIn;
    },

    rowSize(): number {
      return this.size * this.operator.totalSizeOut;
    },

    allTileLocations(): { i: number; j: number }[] {
      return range(this.operator.totalSizeOut)
        .flatMap((j) => range(this.operator.totalSizeIn).map((i) => ({
          i, j, re: 0, im: 0,
        })));
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
      const vec = new Vector([new VectorEntry(coords, Cx(1))], [...this.operator.dimensionsOut]);
      this.$emit('columnMouseover', vec);
    },

    /**
     * @todo Make all dimension changes within this component.
     * (After using Operator rather than passed parameteres.)
     */
    swapDimensions(i: number, both = true): void {
      this.selectedEntry = {
        i: -1, j: -1, re: 0, im: 0,
      };
      const newOrder = range(this.operator.dimensionsOut.length);
      newOrder[i] += 1;
      newOrder[i + 1] -= 1;
      if (both) {
        this.operator = this.operator.permute(newOrder);
      } else {
        this.operator = this.operator.permute(newOrder, range(this.operator.dimensionsIn.length));
      }
    },

    changeBasis(bases: IBases, basis: string) {
      this.operator = this.operator.toBasisAll(bases.name, basis);
    },
  },
});
</script>

<style scoped lang="scss">
.matrix-viewer {
  display: flex;
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
}
.legend-container {
  //display: block;
  margin-top: 40px;
}
.matrix-legend {
  padding-top: 10px;
  padding-bottom: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  //width: 300px;
}
.legend-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  font-weight: 300;
  padding-bottom: 10px;
}
.quantum-matrix {
  display: inline-block;
}

.label {
  font-size: 12px;
  text-anchor: middle;
  fill: rgba(255, 255, 255, 0.5);
  cursor: default;
  text-transform: uppercase;
  font-weight: 300;
}

.selected-column {
  fill: rgba(255, 255, 255, 0.1);
  stroke: #ffffff;
  stroke-width: 1px;
}

.entry-tile {
  fill: rgba(0, 0, 0, 0);
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 1px;
}

.entry-boarder {
  fill: none;
  stroke: #fff;
  stroke-width: 1px;
}

.tile-value {
  cursor: pointer;
}

.tile-value:hover {
  stroke: rgb(255, 255, 255);
  stroke-width: 2px;
}

.swap-label,
.dimension-label {
  font-size: 12px;
  text-anchor: middle;
  fill: rgba(255, 255, 255, 0.5);
  cursor: default;
  text-transform: uppercase;
  font-weight: 300;
}
</style>
