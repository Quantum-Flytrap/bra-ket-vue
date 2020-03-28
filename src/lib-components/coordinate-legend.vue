<template>
  <div>
    <div
      :class="coordLegendClass"
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
import { dimensionNameToColor } from '@/lib-components/utils';

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
  computed: {
    coordLegendClass(): string {
      return this.darkMode ? 'legend-dark' : 'legend-bright';
    },
  },
  methods: {
    dimensionNameToColor(dimName: string, darkStyle: boolean): string {
      return dimensionNameToColor(dimName, darkStyle);
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../style-variables.scss";

.legend-dark, .legend-bright {
  display: inline;
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 10px;
  font-family: $mainFont;
  text-transform: uppercase;
  & .legend-complex {
    margin-right: 5px;
  }
  & .legend-dimension {
    margin: 5px;
  }
}

.legend-dark {
  & .legend-complex {
    color: #d28fff;
  }
  & .legend-dimension {
    color: #fff;
  }
}

.legend-bright {
  & .legend-complex {
    color: #7a06c7;
  }
  & .legend-dimension {
    color: #000;
  }
}
</style>
