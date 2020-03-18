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
.btn-group-dark {
  display: flex;
  margin-bottom: 5px;
  overflow: hidden;
  align-content: space-between;
  flex-wrap: wrap;
}
.button-dark {
  font-family: "Montserrat", Helvetica, Arial, sans-serif;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  color: white;
  padding: 4px 12px;
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
  font-family: "Montserrat", Helvetica, Arial, sans-serif;
  background-color: rgba(168, 168, 168, 0.2);
  cursor: pointer;
  color: #242424;
  padding: 4px 12px;
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
