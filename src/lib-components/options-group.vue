<template>
  <div
    ref="wrapper"
    class="btn-group"
  >
    <span
      v-for="(option, index) in options"
      :key="`option-${index}`"
      :class="buttonStyle(option)"
      @click="$emit('selected', option)"
    >
      {{ option }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
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

.button-dark, .button-bright {
  display: inline-block;
  font-family: $mainFont;
  cursor: pointer;
  padding: 3px 8px;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 9px;
  transition: 0.5s;
  margin: 3px;
}

.button-dark {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  &.selected {
    background: rgba(255, 255, 255, 0.3);
  }
}

.button-bright {
  background-color: rgba(168, 168, 168, 0.2);
  color: #242424;
  &:hover {
    background: rgba(168, 168, 168, 0.4);
  }
  &.selected {
    background: rgba(168, 168, 168, 0.4);
  }
}
</style>
