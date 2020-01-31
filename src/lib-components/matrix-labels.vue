<template>
  <g
    class="labels-in"
    :transform="transformation"
  >
    <text
      class="label"
      :transform="`translate(${spatialLength / 2}, ${scale(-0.4)}) ${axisLabelTransformation}`"
    >
      {{ axisLabel }}
    </text>
    <text
      v-for="(coord, i) in coordNames[0]"
      :key="`label-in-1-${coord}`"
      class="label-in"
      :transform="`translate(${scale(coordNames[1].length * (i + 0.5))}, ${scale(0.5)}) ${invTransformation}`"
    >
      {{ coord }}
    </text>
    <rect
      v-for="(label, i) in labels"
      :key="`menu-tile-out-2-${i}`"
      class="menu-tile"
      :x="scale(i)"
      :y="scale(1)"
      :width="size"
      :height="size"
    />
    <text
      v-for="(label, i) in labels"
      :key="`label-in-2-${label}`"
      class="label-in"
      :transform="`translate(${scale(i + 0.5)}, ${scale(1.5)}) ${invTransformation}`"
    >
      {{ label[1] }}
    </text>
    <rect
      v-for="(coord, i) in coordNames[0]"
      :key="`menu-tile-out-1-${i}`"
      class="menu-tile-head"
      :x="scale(coordNames[1].length * i)"
      :y="scale(0)"
      :width="coordNames[1].length * size"
      :height="2 * size"
    />
    <g
      v-if="dimensionNames"
      class="dimension-labels"
      @click="$emit('swapDimension')"
    >
      <text
        v-for="(dimensionName, j) in dimensionNames"
        :key="`label-${dimensionName}`"
        :transform="`translate(${spatialLength + scale(0.25)}, ${scale(j + 0.5)}) ${axisLabelTransformation}`"
        class="dimension-label"
      >
        {{ dimensionName }}
      </text>
      <text
        :transform="`translate(${spatialLength + scale(1.25)}, ${scale(1)}) ${invTransformation}`"
        class="dimension-swap"
      >
        ⇄
      </text>
    </g>
  </g>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {},
})

export default class MatrixLabels extends Vue {
  @Prop({ default: () => 40 }) private size!: number

  @Prop({ default: () => '' }) private axisLabel!: string

  @Prop({ required: true }) private location!: string

  @Prop({ required: true }) private coordNames!: string[][]

  @Prop({ default: () => [] }) private selected!: number[]

  @Prop({ default: () => [] }) private dimensionNames!: number[]

  scale(i: number): number {
    return i * this.size;
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

  get labels(): string[] {
    const [names1, names2] = this.coordNames;
    return names1.flatMap((coord1) => names2.map((coord2) => `${coord1}${coord2}`));
  }

  get spatialLength(): number {
    return this.size * this.coordNames.map((coords) => coords.length).reduce((a, b) => a * b);
  }
}
</script>

<style scoped lang="scss">
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

.menu-tile {
  fill: rgba(0, 0, 0, 0);
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 1px;
}

.menu-tile-head {
  fill: none;
  stroke: #fff;
  stroke-width: 1px;
}

</style>
