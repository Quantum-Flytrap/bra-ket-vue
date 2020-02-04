<script lang="ts">
import Vue from 'vue';
import {
  Photons, Operator, Elements, Dimension,
} from 'quantum-tensors';
import { KetViewer, QuantumMatrix } from '@/entry';
import KetList from './lib-components/ket-list-viewer.vue';

const sizeX = 8;
const sizeY = 8;
const state = new Photons(sizeX, sizeY);
state.addPhotonIndicator(0, 2, '>', 'H');
const state0 = state.copy();
const operations: [number, number, Operator][] = [[0, 2, Elements.beamSplitter(135)]];
state.actOnSinglePhotons(operations);
const state1 = state.copy();
state.propagatePhotons();


export default Vue.extend({
  name: 'ServeDev',
  components: {
    KetViewer,
    QuantumMatrix,
    KetList,
  },
  data() {
    return {
      state,
      operator: Elements.beamSplitter(45),
      operator2: Operator.identity([Dimension.spin()]),
      operator3: Operator.identity([Dimension.spin(), Dimension.position(3, 'energy'), Dimension.polarization()]),
      steps: [
        { value: 1, state: state0 },
        { value: 0.5, state: state1 },
        { value: 0.25, state },
      ],
    };
  },
});
</script>

<template>
  <div id="app">
    <ket-viewer :photons="state" />
    <ket-viewer
      :photons="state"
      :show-legend="false"
      :show-table="false"
    />
    <quantum-matrix :operator="operator" />
    <quantum-matrix :operator="operator2" />
    <quantum-matrix :operator="operator3" />
    <ket-list :steps="steps" />
    <div />
  </div>
</template>

<style lang="scss" scoped>
#app {
  background-color: #242424; //GREY
  // background-color: #210235; //QG DARK PURPLE
  // background-color: #2e006a; //QG BRIGHT PURPLE
}
.ket-viewer{
  max-width: 500px;
  padding: 30px;
}
.quantum-matrix{
  margin: 30px;
}
.ket-list{
  max-width: 700px;
  padding: 30px;
}
</style>
