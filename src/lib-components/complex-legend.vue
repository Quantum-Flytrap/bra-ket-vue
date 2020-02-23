<template>
  <svg
    class="quantum-matrix"
    :width="150"
    :height="100"
  >
    <g
      class="legend"
      :transform="`translate(35, 20)`"
    >
      <g>
        <text
          class="label"
          :x="0"
          :y="0"
        >
          Amplitude
        </text>
        <circle
          class="radius-reference"
          :cx="scale(0)"
          :cy="scale(1)"
          :r="rScale(1)"
        />
        <circle
          class="radius-value"
          :cx="scale(0)"
          :cy="scale(1)"
          :r="selectedNonzero ? rScale(re, im) : rScale(1)"
        />
        <text
          v-if="selectedNonzero"
          class="label"
          :x="rScale(0)"
          :y="scale(2)"
        >
          {{ Math.sqrt(re ** 2 + im ** 2 || 0).toFixed(3) }}
        </text>
      </g>
      <g :transform="`translate(${scale(2.3)}, 0)`">
        <text
          class="label"
          :x="0"
          :y="0"
        >
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
        <text
          v-if="selectedNonzero"
          class="label"
          :x="rScale(0)"
          :y="scale(2)"
        >
          {{ selectedPhaseTau.toFixed(2) }} 𝛕
        </text>
      </g>
    </g>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue';
import { range } from '@/lib-components/utils';
import { colorComplex } from '@/lib-components/colors';

export default Vue.extend({
  props: {
    size: {
      type: Number,
      default: 40,
    },
    re: {
      type: Number,
      default: 0,
    },
    im: {
      type: Number,
      default: 0,
    },
  },
  computed: {

    arcs(): any[] {
      return range(8).map((i) => {
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
      });
    },

    selectedNonzero(): boolean {
      return this.re !== 0 || this.im !== 0;
    },

    selectedEntryPhaseId(): number {
      const phi = Math.atan2(this.im, this.re);
      return (Math.round((8 * phi) / (2 * Math.PI)) + 8) % 8;
    },

    selectedPhaseTau(): number {
      const phi = Math.atan2(this.im, this.re);
      return phi / (2 * Math.PI);
    },
  },
  methods: {
    scale(i: number): number {
      return i * this.size;
    },

    generateColor(re: number, im: number): string {
      return colorComplex(re, im);
    },

    rScale(re: number, im = 0): number {
      return 0.46 * this.size * Math.sqrt(re ** 2 + im ** 2);
    },
  },
});
</script>

<style scoped lang="scss">
.label {
  font-size: 12px;
  text-anchor: middle;
  fill: rgba(255, 255, 255, 0.5);
  cursor: default;
  text-transform: uppercase;
  font-weight: 300;
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
