<template>
  <g
    class="matrix-labels"
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
          :transform="`translate(${scale(multipliers[i] * (j + 0.5))}, ${scale(0.5)}) ${invTransformation}`"
        >
          {{ coord }}
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
import { range } from '@/lib-components/utils';

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

  get multipliers(): number[] {
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
  }

  get times(): number[] {
    const lengths = this.coordNames.map((coords) => coords.length);
    let m = 1;
    const res: number[] = [];
    lengths.forEach((x) => {
      res.push(m);
      m *= x;
    });
    return res;
  }

  get total(): number {
    return this.coordNames.map((coords) => coords.length).reduce((a, b) => a * b);
  }

  get spatialLength(): number {
    return this.size * this.coordNames.map((coords) => coords.length).reduce((a, b) => a * b);
  }

  range(n: number): number[] {
    return range(n);
  }
}
</script>

<style scoped lang="scss">
text.coord {
  font-size: 16px;
  dominant-baseline: central;
  text-anchor: middle;
  fill: white;
  cursor: default;
  font-weight: 300;
  &.selected {
    fill: rgb(248, 17, 17);
  }
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

.menu-tile-outline {
  fill: none;
  stroke: #fff;
  stroke-width: 1px;
}

</style>
