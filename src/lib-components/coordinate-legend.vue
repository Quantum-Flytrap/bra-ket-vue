<template>
  <div>
    <div
      :class="coordLegendClass(darkMode)"
    >
      <span v-if="complexStyle !== 'color'">
        <span class="legend-complex">amplitude</span>
      </span>
      <span>
        <span
          v-for="(dimName, i) in dimensionNames"
          :key="`legend-dimension-${dimName}-${i}`"
          class="legend-dimension"
          :style="{ color: dimensionNameToColor(dimName, darkMode) }"
        >
          {{ dimName }}
        </span>
      </span>
    </div>
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
    darkMode: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    coordLegendClass(darkStyle = true): string {
      if (darkStyle) {
        return 'legend-dark';
      }
      return 'legend-bright';
    },
    dimensionNameToColor(dimName: string, darkStyle = false): string {
      if (darkStyle) {
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
      } else {
        switch (dimName) {
          case 'direction':
            return '#ff0055';
          case 'polarization':
            return '#ff9100';
          case 'spin':
            return '#0091ff';
          default:
            return '#242424';
        }
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

.legend-dark {
  display: inline;
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
.legend-bright {
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 10px;
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
  text-transform: uppercase;
  & .legend-complex {
    color: #7a06c7;
    margin-right: 5px;
  }
  & .legend-dimension {
    color: #000;
    margin: 5px;
  }
}
</style>
