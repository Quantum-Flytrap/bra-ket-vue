<template>
  <g
    :class="matrixLabels(darkMode)"
    :transform="transformation"
  >
    <text
      class="label"
      :transform="`translate(${spatialLength / 2}, ${scale(-0.4)}) ${axisLabelTransformation}`"
    >
      {{ axisLabel }}
    </text>
    <g
      v-for="(coordNamesDim, i) in coordNames"
      :key="`dim-group-${i}`"
      :transform="`translate(0, ${scale(i)})`"
    >
      <g
        v-for="k in range(times[i])"
        :key="`time-${i}-${k}`"
        :transform="`translate(${scale(k * total / times[i])}, 0)`"
      >
        <rect
          v-for="(coord, j) in coordNamesDim"
          :key="`menu-tile-${i}-${coord}`"
          class="menu-tile"
          :x="scale(multipliers[i] * j)"
          :y="scale(0)"
          :width="multipliers[i] * size"
          :height="size"
        />
        <text
          v-for="(coord, j) in coordNamesDim"
          :key="`coord-${i}-${coord}`"
          class="coord"
          :class="{selected: isSelected(k * total / times[i] + multipliers[i] * j, multipliers[i])}"
          :transform="`translate(${scale(multipliers[i] * (j + 0.5))}, ${scale(0.5)}) ${invTransformation}`"
        >
          {{ coordPrettier(coord) }}
        </text>
      </g>
    </g>
    <rect
      class="menu-tile-outline"
      :x="scale(0)"
      :y="scale(0)"
      :width="size * total"
      :height="size * coordNames.length"
    />
  </g>
</template>

<script lang="ts">
import Vue from 'vue';
import { range, coordPrettier } from '@/lib-components/utils';

export default Vue.extend({
  props: {
    size: {
      type: Number,
      default: 40,
    },
    axisLabel: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: true,
      default: 'top',
    },
    coordNames: {
      type: Array as () => string[][],
      required: true,
      default: () => [[]],
    },
    selected: {
      type: Array as () => number[],
      default: () => [],
    },
    darkMode: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    /**
     * Global transformation.
     * @todo 'right' and 'bottom'
     */
    transformation(): string {
      switch (this.location) {
        case 'top':
          return '';
        case 'left':
          return 'scale(-1, 1) rotate(90)';
        default:
          return '';
      }
    },

    axisLabelTransformation(): string {
      switch (this.location) {
        case 'top':
          return '';
        case 'left':
          return 'scale(-1, 1)';
        default:
          return '';
      }
    },

    invTransformation(): string {
      switch (this.location) {
        case 'top':
          return '';
        case 'left':
          return 'scale(-1, 1) rotate(90)';
        default:
          return '';
      }
    },

    multipliers(): number[] {
      const lengths = this.coordNames.map((coords) => coords.length);
      lengths.reverse();

      let m = 1;
      const res: number[] = [];
      lengths.forEach((x) => {
        res.push(m);
        m *= x;
      });
      res.reverse();
      return res;
    },

    times(): number[] {
      const lengths = this.coordNames.map((coords) => coords.length);
      let m = 1;
      const res: number[] = [];
      lengths.forEach((x) => {
        res.push(m);
        m *= x;
      });
      return res;
    },

    total(): number {
      return this.coordNames.map((coords) => coords.length).reduce((a, b) => a * b);
    },

    spatialLength(): number {
      return this.size * this.coordNames.map((coords) => coords.length).reduce((a, b) => a * b);
    },
  },
  methods: {
    scale(i: number): number {
      return i * this.size;
    },

    range(n: number): number[] {
      return range(n);
    },

    isSelected(pos: number, span: number): boolean {
      return this.selected
        .map((x) => (pos <= x) && (x < pos + span))
        .reduce((a, b) => a || b, false);
    },

    coordPrettier(coord: string): string {
      return coordPrettier(coord);
    },

    matrixLabels(darkStyle = true): string {
      if (darkStyle) {
        return 'matrix-labels-dark';
      }
      return 'matrix-labels-bright';
    },
  },
});
</script>

<style scoped lang="scss">
.matrix-labels-dark{
  & text.coord {
    font-size: 16px;
    dominant-baseline: central;
    text-anchor: middle;
    fill: rgba(255, 255, 255, 0.5);
    cursor: default;
    font-weight: 300;
    &.selected {
      fill: rgba(255, 255, 255, 1);
      font-weight: 500;
    }
  }
  & .label {
    font-size: 12px;
    text-anchor: middle;
    fill: rgba(255, 255, 255, 0.5);
    cursor: default;
    text-transform: uppercase;
    font-weight: 300;
  }
  & .menu-tile {
    fill: rgba(0, 0, 0, 0);
    stroke: rgba(255, 255, 255, 0.1);
    stroke-width: 1px;
  }
  & .menu-tile-outline {
    fill: none;
    stroke: #fff;
    stroke-width: 1px;
  }
}

.matrix-labels-bright{
  & text.coord {
    font-size: 16px;
    dominant-baseline: central;
    text-anchor: middle;
    fill: rgba(0, 0, 0, 0.6);
    cursor: default;
    font-weight: 300;
    &.selected {
      fill: rgba(0, 0, 0, 1);
      font-weight: 500;
    }
  }
  & .label {
    font-size: 12px;
    text-anchor: middle;
    fill: rgba(0, 0, 0, 0.6);
    cursor: default;
    text-transform: uppercase;
    font-weight: 300;
  }
  & .menu-tile {
    fill: rgba(255, 255, 255, 0);
    stroke: rgba(0, 0, 0, 0.1);
    stroke-width: 1px;
  }
  & .menu-tile-outline {
    fill: none;
    stroke: #000;
    stroke-width: 1px;
  }
}
</style>
