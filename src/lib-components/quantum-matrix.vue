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
          />
        </g>
        <g :transform="`translate(${1 * size}, ${(coordNamesIn.length + 1) * size})`">
          <matrix-labels
            :size="size"
            axis-label="output"
            location="left"
            :coordNames="coordNamesOut"
            :dimensionNames="dimensionNamesOut"
          />
        </g>
        <g :transform="`translate(${(coordNamesOut.length + 1) * size}, ${(coordNamesIn.length + 1) * size})`">
          <rect
            v-for="d in allTileLocations"
            :key="`entry-tile-${d.i}-${d.j}`"
            class="entry-tile"
            :x="scale(d.i)"
            :y="scale(d.j)"
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
            v-if="selectedColumn > -1"
            class="selected-column"
            :x="scale(selectedColumn)"
            :y="0"
            :width="size"
            :height="columnSize"
          />
          <circle
            v-for="d in matrixElements"
            :key="`circle-${d.i}-${d.j}`"
            class="tile-value"
            :cx="scale(d.i + 0.5)"
            :cy="scale(d.j + 0.5)"
            :r="rScale(d.re, d.im)"
            :style="{ fill: generateColor(d.re, d.im) }"
            @mouseover="tileMouseOver(d)"
          />
        </g>
      </svg>
    </div>
    <div class="legend-container">
      <div class="matrix-legend">
        <svg
          class="quantum-matrix"
          :width="300"
          :height="30"
        >
          <g
            class="labels-out"
            :transform="`translate(10, 20)`"
          >
            <g
              class="dimension-labels"
              @click="swapDimensions()"
            >
              <text
                v-for="(dimensionName, j) in dimensionNamesOut"
                :key="`label-${dimensionName}`"
                :transform="`translate(${scale(j + 0.5)},${columnSize + scale(0.25)}) rotate(270)`"
                class="dimension-label"
              >
                {{ dimensionName }}
              </text>
              <text class="dimension-swap">
                ⇅
              </text>
            </g>
          </g>
        </svg>
      </div>
      <div class="matrix-legend">
        <div class="legend-text">
          base change
        </div>
        <div>
          <viewer-button type="icon">
            →  ↑
          </viewer-button>
          <viewer-button type="icon">
            ↖ ↗
          </viewer-button>
          <viewer-button type="icon">
            ↺  ↻
          </viewer-button>
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Operator } from 'quantum-tensors';
import { colorComplex } from '@/lib-components/colors';
import { range } from '@/lib-components/utils';
import MatrixLabels from '@/lib-components/matrix-labels.vue';
import ViewerButton from '@/lib-components/viewer-button.vue';
import ComplexLegend from '@/lib-components/complex-legend.vue';

interface IMatrixElement {
  i: number
  j: number
  re: number
  im: number
}

@Component({
  components: {
    MatrixLabels,
    ViewerButton,
    ComplexLegend,
  },
})

export default class QuantumMatrix extends Vue {
  @Prop({ default: () => 40 }) private size!: number

  @Prop({ default: () => [[]] }) private operator!: Operator

  /**
   * Temporary, to convert from operator.
   */
  get matrixElements(): IMatrixElement[] {
    return this.operator.toIndexIndexValues().map((entry) => ({
      i: entry.i,
      j: entry.j,
      re: entry.v.re,
      im: entry.v.im,
    }));
  }

  // ['→', '↑', '←', '↓'];

  get coordNamesIn(): string[][] {
    return this.operator.coordNamesIn;
  }

  get coordNamesOut(): string[][] {
    return this.operator.coordNamesOut;
  }

  get dimensionNamesOut(): string[] {
    return this.operator.dimensionsOut.map((dim) => dim.name);
  }

  selectedColumn = -1

  selectedEntry: IMatrixElement = {
    i: -1, j: -1, re: 0, im: 0,
  }

  // get selectedInLabelOne(): string {
  //   if (this.selectedEntry.i < 0) {
  //     return '';
  //   }
  //   return this.labelsIn[this.selectedEntry.i][0];
  // }

  get selectedOutputLabels(): { ones: string[]; indices: number[] } {
    const js = this.matrixElements.filter((d) => d.i === this.selectedEntry.i);
    const indices = js.map((d) => d.j);
    const ones = indices.map((j) => this.labelsOut[j][0]);
    return { ones, indices };
  }

  /**
   * @see {@link labelsIn}
   */
  get labelsOut(): string[] {
    const [names1, names2] = this.coordNamesOut;
    return names1.flatMap((coord1) => names2.map((coord2) => `${coord1}${coord2}`));
  }

  get columnSize(): number {
    return this.size * this.operator.totalSizeIn;
  }

  get rowSize(): number {
    return this.size * this.operator.totalSizeOut;
  }

  get allTileLocations(): { i: number; j: number }[] {
    return range(this.operator.totalSizeOut)
      .flatMap((j) => range(this.operator.totalSizeIn).map((i) => ({
        i, j, re: 0, im: 0,
      })));
  }

  scale(i: number): number {
    return i * this.size;
  }

  generateColor(re: number, im: number): string {
    return colorComplex(re, im);
  }

  rScale(re: number, im = 0): number {
    return 0.5 * this.size * Math.sqrt(re ** 2 + im ** 2);
  }

  /**
   * @todo Show directly on the legend.
   */
  tileMouseOver(tile: IMatrixElement): void {
    this.selectedColumn = tile.i;
    this.selectedEntry = tile;
    this.$emit('columnMouseover', tile.i);
  }

  /**
   * @todo Make all dimension changes within this component.
   * (After using Operator rather than passed parameteres.)
   */
  swapDimensions(): void {
    this.selectedColumn = -1; // later we reassign
    this.$emit('swapDimensions');
  }
}
</script>

<style scoped lang="scss">
.matrix-viewer {
  display: flex;
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
}
.legend-container {
  display: block;
}
.matrix-legend {
  margin-top: 30px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  width: 300px;
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
