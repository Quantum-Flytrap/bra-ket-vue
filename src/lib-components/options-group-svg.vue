<template>
  <div
    ref="wrapper"
    class="btn-group"
  >
    <span
      v-for="(option, index) in options"
      :key="`option-${index}`"
      class="button"
      :class="{ selected: option === selectedOption }"
      @click="$emit('selected', option)"
    >
      <svg
        class="base-change"
        :width="38"
        :height="19"
        :class="buttonStyle(option)"
      >
        <g
          v-if="option == 'HV'"
          class="HV"
          :style="{ fill: svgColor}"
        >
          <polygon points="16.2,9 10.8,9 10.8,7 6.5,9.5 10.8,12 10.8,10 16.2,10 16.2,12 20.5,9.5 16.2,7" />
          <polygon points="29,6.3 31,6.3 28.5,2 26,6.3 28,6.3 28,12.7 26,12.7 28.5,17 31,12.7 29,12.7" />
        </g>
        <g
          v-if="option == 'DA'"
          class="DA"
          :style="{ fill: svgColor}"
        >
          <polygon points="14.1,11.4 9.6,6.9 11,5.5 6.2,4.2 7.5,9 8.9,7.6 13.4,12.1 12,13.5 16.8,14.8 15.5,10" />
          <polygon points="30.5,9 31.8,4.2 27,5.5 28.4,6.9 23.9,11.4 22.5,10 21.2,14.8 26,13.5 24.6,12.1 29.1,7.6" />
        </g>
        <g
          v-if="option == 'LR'"
          class="LR"
          :style="{ fill: svgColor}"
        >
          <path
            d="M10.4,2.9c-3.2,0-5.8,2.6-5.8,5.8h1c0-2.6,2.2-4.8,4.8-4.8c2.6,0,4.8,2.2,4.8,4.8c0,2.4-1.9,4.4-4.2,4.7,
            l0.6-1.6l-4.9,0.8l3.2,3.8l0.7-1.9c3.1-0.1,5.6-2.7,5.6-5.8C16.2,5.5,13.6,2.9,10.4,2.9z"
          />
          <path
            d="M27.7,3.9c2.6,0,4.8,2.2,4.8,4.8h1c0-3.2-2.6-5.8-5.8-5.8s-5.8,2.6-5.8,5.8c0,3.1,2.5,5.7,5.6,5.8l0.7,1.9,
            l3.2-3.8l-5-0.8l0.6,1.6c-2.3-0.3-4.1-2.4-4.1-4.7C22.9,6.1,25.1,3.9,27.7,3.9z"
          />
        </g>
      </svg>
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    selectedOption: {
      type: String,
      default: '',
    },
    options: {
      type: Array as () => string[],
      default: () => ['a', 'b', 'c'],
    },
    darkMode: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    svgColor(): string {
      return this.darkMode ? 'white' : '#242424';
    },
  },
  methods: {
    buttonStyle(option: string): Record<string, boolean> {
      return {
        'button-dark': this.darkMode,
        'button-bright': !this.darkMode,
        selected: option === this.selectedOption,
      };
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../style-variables.scss";

.btn-group {
  display: flex;
  margin-bottom: 5px;
  overflow: hidden;
  align-content: space-between;
  flex-wrap: wrap;
}

.button {
  font-family: $mainFont;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 9px;
  transition: 0.5s;
  margin: 3px;
}

.button-dark {
  background-color: rgba(255, 255, 255, 0.1);
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  &.selected {
    background: rgba(255, 255, 255, 0.3);
  }
}

.button-bright {
  background-color: rgba(168, 168, 168, 0.2);
  &:hover {
    background: rgba(168, 168, 168, 0.4);
  }
  &.selected {
    background: rgba(168, 168, 168, 0.4);
  }
}
</style>
