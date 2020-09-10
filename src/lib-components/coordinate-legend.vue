<template>
  <div class="legend-main">
    <div :class="coordLegendClass">
      <span
        v-if="complexStyle !== 'color'"
        class="legend-complex"
      >amplitude</span>
      <span
        v-for="(dimName, i) in dimensionNames"
        :key="i"
        class="legend-dimension"
        :style="{ color: dimensionNameToColor(dimName, darkMode) }"
      >
        {{ dimName }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { dimensionNameToColor } from '@/lib-components/utils';

export default defineComponent({
  name: 'CoordinateLegend',
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
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  font-size: 10px;
  font-family: $mainFont;
  text-transform: uppercase;
}

.legend-complex, .legend-dimension {
  margin: 5px 5px;
}

.legend-dark {
  & > .legend-complex {
    color: #d28fff;
  }
  & > .legend-dimension {
    color: #fff;
  }
}

.legend-bright {
  & > .legend-complex {
    color: #7a06c7;
  }
  & > .legend-dimension {
    color: #000;
  }
}
</style>
