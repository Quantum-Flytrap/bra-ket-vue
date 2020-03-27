<template>
  <div
    ref="wrapper"
    class="btn-group"
  >
    <div v-if="darkMode === true">
      <span
        v-for="(option, index) in options"
        :key="`option-${index}`"
        class="button-dark"
        :class="{ selected: option === selectedOption }"
        @click="$emit('selected', option)"
      >
        {{ option }}
      </span>
    </div>
    <div v-if="darkMode === false">
      <span
        v-for="(option, index) in options"
        :key="`option-${index}`"
        class="button-bright"
        :class="{ selected: option === selectedOption }"
        @click="$emit('selected', option)"
      >{{ option }}</span>
    </div>
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
});
</script>

<style lang="scss" scoped>
@import "../style-variables.scss";

.button-dark {
  display: inline-block;
  font-family: $mainFont;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  color: white;
  padding: 3px 8px;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 9px;
  transition: 0.5s;
  margin: 3px;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  &.selected {
    background: rgba(255, 255, 255, 0.3);
  }
}
.button-bright {
  display: inline-block;
  font-family: $mainFont;
  background-color: rgba(168, 168, 168, 0.2);
  cursor: pointer;
  color: #242424;
  padding: 3px 8px;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 9px;
  transition: 0.5s;
  margin: 3px;
  &:hover {
    background: rgba(168, 168, 168, 0.4);
  }
  &.selected {
    background: rgba(168, 168, 168, 0.4);
  }
}
</style>
