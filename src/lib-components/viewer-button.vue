<template>
  <button>
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class ViewerButton extends Vue {
  @Prop({ default: 'basic' }) readonly type!: string
}
</script>

<style scoped lang="scss">
button {
  display: inline-block;
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
  border: none;
  &.basic {
    font-size: 9px;
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
  &.icon {
    font-size: 13px;
    line-height: 5px;
    height: 19px;
    width: 55px;
    padding: none;
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      text-decoration: none;
    }
  }
}
</style>
