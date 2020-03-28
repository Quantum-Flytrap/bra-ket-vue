<template>
  <g
    :class="dimensionLabels"
    :transform="transformation"
  >
    <text
      v-for="(dimensionName, i) in dimensionNamesNumbered"
      :key="`label-${dimensionName}-${i}`"
      class="dimension-label"
      :transform="`translate(${scale(0.25)}, ${scale(i + 0.5)}) ${axisLabelTransformation}`"
    >
      {{ dimensionName }}
    </text>
    <text
      v-for="i in swaps"
      :key="`label-${i}`"
      class="dimension-swap"
      :transform="`translate(${scale(0.5)}, ${scale(i + 1)}) ${invTransformation}`"
      @click="$emit('swapDimensions', i)"
    >
      ⇄
    </text>
  </g>
</template>

<script lang="ts">
import Vue from 'vue';
import { range } from '@/lib-components/utils';

export default Vue.extend({
  props: {
    size: {
      type: Number,
      default: 40,
    },
    location: {
      type: String,
      required: true,
    },
    dimensionNames: {
      type: Array as () => string[],
      default: () => [],
    },
    darkMode: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    swaps(): number[] {
      return range(this.dimensionNames.length - 1);
    },

    /**
     * When there are more dimensions with the same name, adding numbers to them,
     * e.g. ['qubit', 'polarization', 'spin', 'qubit'] -> ['qubit 1', 'polarization', 'spin', 'qubit 2']
     */
    dimensionNamesNumbered(): string[] {
      const counter = new Map<string, number>();
      return this.dimensionNames
        .map((name): [string, number] => {
          const count = 1 + (counter.get(name) || 0);
          counter.set(name, count);
          return [name, count];
        })
        .map(([name, count]) => (counter.get(name) === 1 ? name : `${name} ${count}`));
    },

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
    dimensionLabels(): string {
      return this.darkMode ? 'dimension-labels-dark' : 'dimension-labels-bright';
    },
  },
  methods: {
    scale(i: number): number {
      return i * this.size;
    },
  },
});
</script>

<style scoped lang="scss">
@import "../style-variables.scss";

.dimension-labels-dark, .dimension-labels-bright {
  & .dimension-label {
    font-size: $fontSizeDefault;
    text-anchor: end;
    dominant-baseline: central;
    cursor: default;
    text-transform: uppercase;
    font-weight: 300;
  }
  & .dimension-swap {
    font-size: 18px;
    text-anchor: middle;
    dominant-baseline: central;
    cursor: pointer;
    text-transform: uppercase;
  }
}

.dimension-labels-dark {
  & .dimension-label {
    fill: rgba(255, 255, 255, 0.5);
  }
  & .dimension-swap {
    fill: white;
  }
}

.dimension-labels-bright {
  & .dimension-label {
    fill: rgba(0, 0, 0, 0.6);
  }
  & .dimension-swap {
    fill: rgb(0, 0, 0);
  }
}
</style>
