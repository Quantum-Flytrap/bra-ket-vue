<script lang="ts">
import Vue from 'vue';
import {
  Photons, Operator, Elements, Dimension, Cx,
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

const operator = Elements.beamSplitter(45);
const operator2 = Operator.fromSparseCoordNames([
  ['u', 'u', Cx(1)],
  ['d', 'd', Cx(-1)],
], [Dimension.spin()]);

const operator3 = Operator.outer([
  Operator.fromSparseCoordNames([
    ['u', 'd', Cx(0, 1)],
    ['d', 'u', Cx(0, -1)],
  ], [Dimension.spin()]),
  Operator.fromSparseCoordNames([
    ['0H', '0H', Cx(Math.SQRT1_2)],
    ['1H', '0H', Cx(Math.SQRT1_2)],
    ['1H', '1H', Cx(Math.SQRT1_2)],
    ['2H', '1H', Cx(Math.SQRT1_2)],
    ['2H', '2H', Cx(Math.SQRT1_2)],
    ['0V', '0V', Cx(1)],
    ['1V', '1V', Cx(1)],
    ['2V', '2V', Cx(1)],
  ], [Dimension.position(3, 'energy'), Dimension.polarization()]),
]);

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
      operator,
      operator2,
      operator3,
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
    <quantum-matrix :operator-raw="operator" />
    <quantum-matrix :operator-raw="operator2" />
    <quantum-matrix :operator-raw="operator3" />
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
