<template>
  <div
    ref="wrapper"
    class="view-button-group"
  >
    <div class="btn-group">
      <span
        v-for="(option, index) in options"
        :key="`option-${index}`"
        class="button"
        :class="{ selected: option === selectedOption }"
        @click="$emit('selected', option)"
      >
        {{ option }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ViewButtonGroup extends Vue {
  @Prop({ default: 'polar' }) readonly selectedOption!: string

  @Prop({ default: () => ['polar', 'cartesian', 'color'] }) readonly options!: string[]
}
</script>

<style lang="scss" scoped>
.btn-group {
  display: flex;
  justify-content: center;
  max-width: 100%;
  margin-bottom: 5px;
}

.button {
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
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
}
</style>
