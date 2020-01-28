<template>
  <div class="legend">
    <span v-if="selectedStyle === 'color'">
      <span class="legend-coord-xy"> x,y coordinates</span>
      <span class="legend-dir">direction</span>
      <span class="legend-pol">polarization</span>
    </span>
    <span v-else>
      <span class="legend-complex">amplitude (complex number)</span>
      <span class="legend-coord-xy"> x,y coordinates</span>
      <span class="legend-dir">direction</span>
      <span class="legend-pol">polarization</span>
    </span>
    <!-- <span
      v-for="dim in dimensions"
      :key="`dim-label-${dim.name}`"
      class="dim-label">
      {{ dim.name }}
    </span> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';


@Component({
  components: {},
})
export default class CoordinateLegend extends Vue {
  @Prop({ default: 'polar' }) readonly selectedStyle!: string

  styles = ['polar', 'cartesian', 'color']

  dimensions = [
    { name: 'amplitude (complex number)' },
    { name: 'x,y coordinates' },
    { name: 'direction' },
    { name: 'polarization' },
  ]
}
</script>

<style lang="scss" scoped>
.dim-label {
  color: white;
  padding: 5px;
}

.legend {
  padding-top: 10px;
  padding-bottom: 15px;
  font-size: 10px;
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
  text-transform: uppercase;
  & .legend-complex {
    color: #9d40ff;
    margin-right: 5px;
  }
  & .legend-coord-xy {
    color: #fff;
    margin: 5px;
  }
  & .legend-dir {
    color: #ff0055;
    margin: 5px;
  }
  & .legend-pol {
    color: #ff9100;
    margin-left: 5px;
  }
}
</style>
