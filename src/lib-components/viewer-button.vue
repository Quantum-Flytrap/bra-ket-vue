<template>
  <button :class="computeClass">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class ViewerButton extends Vue {
  @Prop() readonly hoverColor!: string

  @Prop({ default: 'basic' }) readonly type!: string

  @Prop({ default: true }) readonly inline!: boolean

  @Prop() readonly overlay!: boolean

  get computeClass(): string[] {
    return [this.type, this.inline ? 'inline' : '', this.overlay ? 'overlay-btn' : ''];
  }
}
</script>

<style scoped lang="scss">
button {
  display: inline-block;
  outline: white;
  border-width: 1px;
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
  background-color: transparent;
  cursor: pointer;
  color: white;
  padding: 6px 12px;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 0.6rem;
  transition: 0.5s;
  border-radius: 20px;
  margin: 3px;
  &.inline {
    display: inline;
  }
  &.basic {
    font-size: 9px;
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transition: 0.5s;
    }
    &:focus {
      background: rgba(255, 255, 255, 0.1);
    }
  }
  &.icon {
    font-size: 18px;
    line-height: 5px;
    //padding: 3px 10px;
    height: 25px;
    width: 70px;
    padding: none;
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transition: 0.5s;
      text-decoration: none;
    }
    &:focus {
      background: rgba(255, 255, 255, 0.1);
    }
  }
  &.overlay-btn {
    margin: 5px;
    text-decoration: none;
  }
}
</style>
