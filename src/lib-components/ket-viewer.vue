<template>
  <div
    ref="wrapper"
    class="ket-viewer"
  >
    <ket
      class="ket"
      :vector="vector"
      :selected-option="selectedOption"
      :all-bases="allBases"
      :dark-mode="darkMode"
    />
    <hr
      v-if="darkMode === true"
      class="hr-dark"
    >
    <hr
      v-if="darkMode === false"
      class="hr-bright"
    >
    <coordinate-legend
      class="legend"
      :complex-style="selectedOption"
      :dimension-names="dimensionNames"
      :dark-mode="darkMode"
    />
    <hr
      v-if="darkMode === true"
      class="hr-dark"
    >
    <hr
      v-if="darkMode === false"
      class="hr-bright"
    >
    <options-group
      class="options"
      :options="options"
      :dark-mode="darkMode"
      :selected-option="selectedOption"
      @selected="selectedOption = $event"
    />

    <span>
      <span
        v-for="bases in allBases"
        :key="`basis-${bases.name}`"
      >
        <span
          v-if="bases.name == 'polarization'"
        >
          <options-group-svg
            v-if="dimensionNames.indexOf(bases.name) > -1"
            :key="`options-group-basis-${bases.name}`"
            :dark-mode="darkMode"
            :options="bases.availableBases"
            :selected-option="bases.selected"
            @selected="bases.selected = $event"
          />
        </span>
        <span
          v-else
        >
          <options-group
            v-if="dimensionNames.indexOf(bases.name) > -1"
            :key="`options-group-basis-${bases.name}`"
            :dark-mode="darkMode"
            :options="bases.availableBases"
            :selected-option="bases.selected"
            @selected="bases.selected = $event"
          />
        </span>
      </span>
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Vector } from 'quantum-tensors';
import CoordinateLegend from '@/lib-components/coordinate-legend.vue';
import OptionsGroup from '@/lib-components/options-group.vue';
import OptionsGroupSvg from '@/lib-components/options-group-svg.vue';
import Ket from '@/lib-components/ket.vue';

export default Vue.extend({
  components: {
    CoordinateLegend,
    OptionsGroup,
    OptionsGroupSvg,
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
    darkMode: {
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
.options {
  margin-top: 5px;
}
.hr-dark {
  border: 0;
  height: 0;
  margin: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  width:100%
}
.hr-bright {
  border: 0;
  height: 0;
  margin: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.6);
  width:100%
}
</style>
