<template>
  <div
    ref="wrapper"
    class="ket-viewer"
  >
    <options-group
      class="options"
      :options="options"
      :selected-option="selectedOption"
      @selected="selectedOption = $event"
    />
    <ket
      class="ket"
      :vector="vector"
      :selected-option="selectedOption"
      :all-bases="allBases"
    />
    <coordinate-legend
      class="legend"
      :complex-style="selectedOption"
      :dimension-names="dimensionNames"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Vector } from 'quantum-tensors';
import CoordinateLegend from '@/lib-components/coordinate-legend.vue';
import OptionsGroup from '@/lib-components/options-group.vue';
import Ket from '@/lib-components/ket.vue';

export default Vue.extend({
  components: {
    CoordinateLegend,
    OptionsGroup,
    Ket,
  },
  props: {
    vector: {
      type: Object as () => Vector,
      required: true,
    },
    showLegend: {
      type: Boolean,
      default: true,
    },
  },
  data(): any {
    return {
      options: ['polar', 'polarTau', 'cartesian', 'color'],
      selectedOption: 'polar',
      allBases: [
        { name: 'polarization', availableBases: ['HV', 'DA', 'LR'], selected: 'HV' },
        { name: 'spin', availableBases: ['spin-x', 'spin-y', 'spin-z'], selected: 'spin-z' },
        { name: 'qubit', availableBases: ['01', '+-', '+i-i'], selected: '01' },
      ],
    };
  },
  computed: {
    dimensionNames(): string[] {
      return this.vector.names;
    },
  },
});
</script>

<style lang="scss" scoped>
.ket-viewer {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  transition: height 0.5s;
  overflow: hidden;
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
  @media screen and (max-width: 1000px) {
    border: none;
  }
}
.ket {
  padding: 5px 0px;
}
</style>
