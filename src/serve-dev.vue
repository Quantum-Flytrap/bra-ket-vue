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

const opCNOT = Operator.fromSparseCoordNames(
  [
    ['00', '00', Cx(1)],
    ['01', '01', Cx(1)],
    ['10', '11', Cx(1)],
    ['11', '10', Cx(1)],
  ],
  [Dimension.qubit(), Dimension.qubit()],
);

const opToffoli = Operator.fromSparseCoordNames(
  [
    ['000', '000', Cx(1)],
    ['001', '001', Cx(1)],
    ['010', '010', Cx(1)],
    ['011', '011', Cx(1)],
    ['100', '100', Cx(1)],
    ['101', '101', Cx(1)],
    ['111', '110', Cx(1)], // this and
    ['110', '111', Cx(1)], // that differs from identity
  ],
  [Dimension.qubit(), Dimension.qubit(), Dimension.qubit()],
);

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
      opSugar: Elements.sugarSolution(),
      opMirror: Elements.mirror(0),
      opCNOT,
      opToffoli,
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
    <h1>Ket Viewer</h1>
    <ket-viewer
      :photons="state"
      :show-legend="false"
      :show-table="false"
    />
    <h1>Ket Viewer + controls + legend</h1>
    <ket-viewer :photons="state" />
    <h1>Ket List</h1>
    <ket-list :steps="steps" />
    <h1>beamSplitter 50/50</h1>
    <quantum-matrix :operator-raw="operator" />
    <h1>Pauli Z operator for spin</h1>
    <quantum-matrix :operator-raw="operator2" />
    <h1>Another example</h1>
    <quantum-matrix :operator-raw="operator3" />
    <h1>Sugar Solution</h1>
    <quantum-matrix :operator-raw="opSugar" />
    <h1>Mirror</h1>
    <quantum-matrix :operator-raw="opMirror" />
    <h1>CNOT gate</h1>
    <quantum-matrix :operator-raw="opCNOT" />
    <h1>Toffoli gate</h1>
    <quantum-matrix :operator-raw="opToffoli" />
    <div />
  </div>
</template>

<style lang="scss" scoped>
#app {
  background-color: #242424; //GREY
  // background-color: #210235; //QG DARK PURPLE
  // background-color: #2e006a; //QG BRIGHT PURPLE
  padding-left: 80px;
  padding-top: 30px;
}
.ket-viewer{
  max-width: 500px;
  padding: 30px;
}
.quantum-matrix{
  max-width: 500px;
  //padding: 30px;
}
.ket-list{
  max-width: 700px;
  padding: 30px;
}
h1 {
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
  color: rgba(255, 255, 255, 0.6);
  text-align: left;
  text-decoration: none;
  text-transform: uppercase;
  font-weight: 300;
  font-size: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.6);
  padding-top: 10px;
  margin-top: 30px;
  max-width: 1000px;
}
</style>
