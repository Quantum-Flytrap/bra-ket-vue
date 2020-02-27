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
import Vue from 'vue';

export default Vue.extend({
  props: {
    complexStyle: {
      type: String,
      default: 'polar',
    },
    dimensionNames: {
      type: Array as () => string[],
      default: () => [],
    },
  },
  methods: {
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
    },
  },
});
</script>

<style lang="scss" scoped>
.dim-label {
  color: white;
  padding: 5px;
}

.legend {
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 10px;
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
  text-transform: uppercase;
  & .legend-complex {
    color: #d28fff;
    margin-right: 5px;
  }
  & .legend-dimension {
    color: #fff;
    margin: 5px;
  }
}
</style>
