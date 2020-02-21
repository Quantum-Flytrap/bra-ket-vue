<template>
  <g
    class="dimension-labels"
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import { range } from '@/lib-components/utils';

@Component({
  components: {},
})

export default class MatrixDimensions extends Vue {
  @Prop({ default: () => 40 }) private size!: number

  @Prop({ required: true, default: 'top' }) private location!: string

  @Prop({ default: () => [] }) private dimensionNames!: string[]

  scale(i: number): number {
    return i * this.size;
  }

  get swaps(): number[] {
    return range(this.dimensionNames.length - 1);
  }

  /**
   * When there are more dimensions with the same name, adding numbers to them,
   * e.g. ['qubit', 'polarization', 'spin', 'qubit'] -> ['qubit 1', 'polarization', 'spin', 'qubit 2']
   */
  get dimensionNamesNumbered(): string[] {
    const counter = new Map<string, number>();
    return this.dimensionNames
      .map((name): [string, number] => {
        const count = 1 + (counter.get(name) || 0);
        counter.set(name, count);
        return [name, count];
      })
      .map(([name, count]) => (counter.get(name) === 1 ? name : `${name} ${count}`));
  }

  /**
   * Global transformation.
   * @todo 'right' and 'bottom'
   */
  get transformation(): string {
    switch (this.location) {
      case 'top':
        return '';
      case 'left':
        return 'scale(-1, 1) rotate(90)';
      default:
        return '';
    }
  }

  get axisLabelTransformation(): string {
    switch (this.location) {
      case 'top':
        return '';
      case 'left':
        return 'scale(-1, 1)';
      default:
        return '';
    }
  }

  get invTransformation(): string {
    switch (this.location) {
      case 'top':
        return '';
      case 'left':
        return 'scale(-1, 1) rotate(90)';
      default:
        return '';
    }
  }
}
</script>

<style scoped lang="scss">
.dimension-label {
  font-size: 12px;
  text-anchor: end;
  dominant-baseline: central;
  fill: rgba(255, 255, 255, 0.5);
  cursor: default;
  text-transform: uppercase;
  font-weight: 300;
}

.dimension-swap {
  font-size: 18px;
  text-anchor: middle;
  dominant-baseline: central;
  fill: white;
  cursor: pointer;
  text-transform: uppercase;
}
</style>
