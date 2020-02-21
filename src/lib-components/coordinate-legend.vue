<template>
  <div class="legend">
    <span v-if="complexStyle !== 'color'">
      <span class="legend-complex">amplitude (complex number)</span>
    </span>
    <span>
      <span
        v-for="(dimName, i) in dimensionNames"
        :key="`legend-dimension-${dimName}-${i}`"
        class="legend-dimension"
        :style="{ color: dimensionNameToColor(dimName) }"
      >
        {{ dimName }}
      </span>
    </span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class CoordinateLegend extends Vue {
  @Prop({ default: 'polar' }) readonly complexStyle!: string

  @Prop({ default: () => [] }) readonly dimensionNames!: string[]

  dimensionNameToColor(dimName: string): string {
    switch (dimName) {
      case 'direction':
        return '#ff0055';
      case 'polarization':
        return '#ff9100';
      case 'spin':
        return '#0091ff';
      default:
        return '#ffffff';
    }
  }
}
</script>

<style lang="scss" scoped>
.dim-label {
  color: white;
  padding: 5px;
}

.legend {
  padding-top: 10px;
  padding-bottom: 15px;
  font-size: 10px;
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
  text-transform: uppercase;
  & .legend-complex {
    color: #9d40ff;
    margin-right: 5px;
  }
  & .legend-dimension {
    color: #fff;
    margin: 5px;
  }
}
</style>
