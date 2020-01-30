<template>
  <div class="matrix-viewer">
    <div>
      <svg class="quantum-matrix"
        :width="columnSize + 3.5 * size"
        :height="rowSize + 6.5 * size"
        >
        <g class="labels-in" :transform="`translate(${3 * size}, ${1 * size})`">
          <text class="label" :x="rowSize / 2" :y="scale(-0.4)">
            Input
          </text>
          <text
            v-for="(coord, i) in coordNamesIn[0]"
            :key="`label-in-1-${coord}`"
            class="label-in"
            :class="{ 'label-selected': coord === selectedInLabelOne }"
            :x="scale(coordNamesIn[1].length * (i + 0.5))"
            :y="scale(0.5)"
          >
            {{ coord }}
          </text>
          <rect
            v-for="(label, i) in labelsIn"
            :key="`menu-tile-out-2-${i}`"
            class="menu-tile"
            :x="scale(i)"
            :y="scale(1)"
            :width="size"
            :height="size"
          />
          <text
            v-for="(label, i) in labelsIn"
            :key="`label-in-2-${label}`"
            class="label-in"
            :class="{ 'label-selected': i === selectedEntry.i }"
            :x="scale(i + 0.5)"
            :y="scale(1.5)"
          >
            {{ label[1] }}
          </text>
          <rect
            v-for="(coord, i) in coordNamesIn[0]"
            :key="`menu-tile-out-1-${i}`"
            class="menu-tile-head"
            :x="scale(coordNamesIn[1].length * i)"
            :y="scale(0)"
            :width="coordNamesIn[1].length * size"
            :height="2 * size"
          />
        </g>
        <g class="labels-out" :transform="`translate(${1 * size}, ${3 * size})`">
        <text class="label" :transform="`translate(${scale(-0.4)},${columnSize / 2}) rotate(270)`">
            Output
          </text>
          <text
            v-for="(coord, j) in coordNamesOut[0]"
            :key="`label-out-1-${coord}`"
            class="label-out"
            :class="{ 'label-selected': selectedOutputLabels.ones.indexOf(coord) >= 0 }"
            :x="scale(0.5)"
            :y="scale(coordNamesOut[1].length * (j + 0.5))"
          >
            {{ coord }}
          </text>
          <rect
            v-for="(label, j) in labelsOut"
            :key="`menu-tile-in-2-${j}`"
            class="menu-tile"
            :x="scale(1)"
            :y="scale(j)"
            :width="size"
            :height="size"
          />
          <text
            v-for="(label, j) in labelsOut"
            :key="`label-out-2-${label}`"
            class="label-out"
            :class="{ 'label-selected': selectedOutputLabels.indices.indexOf(j) >= 0 }"
            :x="scale(1.5)"
            :y="scale(j + 0.5)"
          >
            {{ label[1] }}
          </text>
          <rect
            v-for="(coord, j) in coordNamesOut[0]"
            :key="`menu-tile-in-1-${j}`"
            class="menu-tile-head"
            :x="scale(0)"
            :y="scale(coordNamesOut[1].length * j)"
            :width="2 * size"
            :height="coordNamesOut[1].length * size"
          />
          <!-- <g class="dimension-labels" @click="swapDimensions()">
            <text
              v-for="(dimensionName, j) in dimensionNamesOut"
              :key="`label-${dimensionName}`"
              :transform="`translate(${scale(j + 0.5)},${columnSize + scale(0.25)}) rotate(270)`"
              class="dimension-label"
            >
              {{ dimensionName }}
            </text>
            <text
              :transform="`translate(${scale(1)},${columnSize + scale(1.25)})`"
              class="dimension-swap"
            >
              ⇄
            </text>
          </g> -->
        </g>

        <g :transform="`translate(${3 * size}, ${3 * size})`">
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
          <rect class="entry-boarder" :x="0" :y="0" :width="columnSize" :height="rowSize" />
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
        <!-- <g class="legend" :transform="`translate(${scale(6)}, ${columnSize + scale(4)})`">
          <g>
            <text class="label" :x="0" :y="0">
              Amplitude
            </text>
            <circle class="radius-reference" :cx="scale(0)" :cy="scale(1)" :r="rScale(1)" />
            <circle
              class="radius-value"
              :cx="scale(0)"
              :cy="scale(1)"
              :r="selectedNonzero ? rScale(selectedEntry.re, selectedEntry.im) : rScale(1)"
            />
            <text v-if="selectedNonzero" class="label" :x="rScale(0)" :y="scale(2)">
              {{ Math.sqrt(selectedEntry.re ** 2 + selectedEntry.im ** 2 || 0).toFixed(3) }}
            </text>
          </g>
          <g :transform="`translate(${scale(3)}, 0)`">
            <text class="label" :x="0" :y="0">
              Phase
            </text>
            <g :transform="`translate(0, ${scale(1)})`">
              <path
                v-for="(a, i) in arcs"
                :key="`arc-${i}`"
                class="phase-arc"
                :style="{
                  fill: generateColor(a.re, a.im),
                  opacity: !selectedNonzero || selectedEntryPhaseId === i ? 1 : 0.25
                }"
                :d="`M 0 0 L ${a.x0} ${a.y0} A ${rScale(1)} ${rScale(1)} 0 0 1 ${a.x1} ${a.y1} Z`"
              />
            </g>
            <text v-if="selectedNonzero" class="label" :x="rScale(0)" :y="scale(2)">
              {{ selectedPhaseTau.toFixed(2) }} 𝛕
            </text>
          </g>
        </g> -->
      </svg>
    </div>
    <div class="legend-container">
      <div class="matrix-legend">
        <svg class="quantum-matrix"
        :width="300"
        :height="30">
          <g class="labels-out" :transform="`translate(10, 20)`">
            <g class="dimension-labels" @click="swapDimensions()">
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
        <div class="legend-text">base change</div>
        <div>
          <viewer-button type=icon>→  ↑</viewer-button>
          <viewer-button type=icon>↖ ↗</viewer-button>
          <viewer-button type=icon>↺  ↻</viewer-button>
        </div>
      </div>
      <div class="matrix-legend" >
        <svg class="quantum-matrix"
        :width="300"
        :height="100">
          <g class="legend" :transform="`translate(35, 20)`">
            <g>
              <text class="label" :x="0" :y="0">
                Amplitude
              </text>
              <circle class="radius-reference" :cx="scale(0)" :cy="scale(1)" :r="rScale(1)" />
              <circle
                class="radius-value"
                :cx="scale(0)"
                :cy="scale(1)"
                :r="selectedNonzero ? rScale(selectedEntry.re, selectedEntry.im) : rScale(1)"
              />
              <text v-if="selectedNonzero" class="label" :x="rScale(0)" :y="scale(2)">
                {{ Math.sqrt(selectedEntry.re ** 2 + selectedEntry.im ** 2 || 0).toFixed(3) }}
              </text>
            </g>
            <g :transform="`translate(${scale(3)}, 0)`">
              <text class="label" :x="0" :y="0">
                Phase
              </text>
              <g :transform="`translate(0, ${scale(1)})`">
                <path
                  v-for="(a, i) in arcs"
                  :key="`arc-${i}`"
                  class="phase-arc"
                  :style="{
                    fill: generateColor(a.re, a.im),
                    opacity: !selectedNonzero || selectedEntryPhaseId === i ? 1 : 0.25
                  }"
                  :d="`M 0 0 L ${a.x0} ${a.y0} A ${rScale(1)} ${rScale(1)} 0 0 1 ${a.x1} ${a.y1} Z`"
                />
              </g>
              <text v-if="selectedNonzero" class="label" :x="rScale(0)" :y="scale(2)">
                {{ selectedPhaseTau.toFixed(2) }} 𝛕
              </text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Operator } from 'quantum-tensors';
import { range } from '@/lib-components/utils';
import { colorComplex } from '@/lib-components/colors';
import ViewerButton from '@/lib-components/viewer-button.vue';

interface IMatrixElement {
  i: number
  j: number
  re: number
  im: number
}

@Component({
  components: {
    ViewerButton,
  },
})

export default class QuanutmMatrix extends Vue {
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

  arcs = range(8).map((i) => {
    const r = this.rScale(1);
    const alpha = (2 * Math.PI * i) / 8;
    const beta = Math.PI / 8;
    return {
      x0: r * Math.cos(alpha - beta),
      y0: r * Math.sin(alpha - beta),
      x1: r * Math.cos(alpha + beta),
      y1: r * Math.sin(alpha + beta),
      re: Math.cos(alpha),
      im: Math.sin(alpha),
    };
  })

  get selectedNonzero(): boolean {
    return this.selectedEntry.re !== 0 || this.selectedEntry.im !== 0;
  }

  get selectedEntryPhaseId(): number {
    const phi = Math.atan2(this.selectedEntry.im, this.selectedEntry.re);
    return (Math.round((8 * phi) / (2 * Math.PI)) + 8) % 8;
  }

  get selectedPhaseTau(): number {
    const phi = Math.atan2(this.selectedEntry.im, this.selectedEntry.re);
    return phi / (2 * Math.PI);
  }

  get selectedInLabelOne(): string {
    if (this.selectedEntry.i < 0) {
      return '';
    }
    return this.labelsIn[this.selectedEntry.i][0];
  }

  get selectedOutputLabels(): { ones: string[]; indices: number[] } {
    const js = this.matrixElements.filter((d) => d.i === this.selectedEntry.i);
    const indices = js.map((d) => d.j);
    const ones = indices.map((j) => this.labelsOut[j][0]);
    return { ones, indices };
  }

  /**
   * @todo Flattening should be in QT.Dimension.
   * Here I do only for 2 dims.
   */
  get labelsIn(): string[] {
    const [names1, names2] = this.coordNamesIn;
    return names1.flatMap((coord1) => names2.map((coord2) => `${coord1}${coord2}`));
  }

  /**
   * @see {@link labelsIn}
   */
  get labelsOut(): string[] {
    const [names1, names2] = this.coordNamesOut;
    return names1.flatMap((coord1) => names2.map((coord2) => `${coord1}${coord2}`));
  }

  get columnSize(): number {
    return this.size * this.labelsIn.length;
  }

  get rowSize(): number {
    return this.size * this.labelsOut.length;
  }

  get allTileLocations(): { i: number; j: number }[] {
    return this.labelsOut.flatMap((_val1, j) => this.labelsIn.map((_val2, i) => ({
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
.label-in,
.label-out {
  font-size: 16px;
  dominant-baseline: central;
  text-anchor: middle;
  fill: white;
  cursor: default;
  font-weight: 300;
}

.label-in.label-selected,
.label-out.label-selected {
  fill: white;
}

.dimension-label {
  font-size: 12px;
  text-anchor: end;
  dominant-baseline: central;
  fill: white;
  cursor: pointer;
  text-transform: uppercase;
}

.dimension-swap {
  font-size: 18px;
  text-anchor: middle;
  dominant-baseline: central;
  fill: white;
  cursor: pointer;
  text-transform: uppercase;
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

.entry-tile,
.menu-tile {
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 1px;
}

.entry-boarder,
.menu-tile-head {
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

.radius-reference {
  fill: white;
  opacity: 0.25;
}

.radius-value {
  fill: white;
}

.phase-arc {
  stroke: rgba(0, 0, 0, 0.1);
  stroke-width: 0.5px;
}
</style>
