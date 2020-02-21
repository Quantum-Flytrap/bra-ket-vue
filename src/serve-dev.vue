<script lang="ts">
import Vue from 'vue';
import {
  Photons, Vector, Operator, Elements, Dimension, Cx, Gates,
} from 'quantum-tensors';
import { KetViewer, MatrixViewer } from '@/entry';
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

const singlet = Vector.fromSparseCoordNames([
  ['ud', Cx(1)],
  ['du', Cx(-1)],
], [Dimension.spin(), Dimension.spin()]).normalize();

const qc0 = Vector.fromSparseCoordNames([
  ['000', Cx(1)],
], [Dimension.qubit(), Dimension.qubit(), Dimension.qubit()]);

const qc1 = Gates.H().mulVecPartial([0], qc0);
const qc2 = Gates.CX().mulVecPartial([0, 1], qc1);
const qc3 = Gates.CCX().mulVec(qc2);

export default Vue.extend({
  name: 'ServeDev',
  components: {
    KetViewer,
    MatrixViewer,
    KetList,
  },
  data() {
    return {
      state,
      singlet,
      operator,
      operator2,
      operator3,
      opSugar: Elements.sugarSolution(),
      opMirror: Elements.mirror(0),
      opCNOT: Gates.CX(),
      opToffoli: Gates.CCX(),
      steps: [
        { value: 1, vector: state0.vector },
        { value: 0.5, vector: state1.vector },
        { value: 0.25, vector: state.vector },
      ],
      stepsQuantumComputing: [
        { value: 1, vector: qc0 },
        { value: 1, vector: qc1 },
        { value: 1, vector: qc2 },
        { value: 1, vector: qc3 },
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
    <ket-viewer :vector="state.vector" />
    <h1>Ket Viewer for a singlet state</h1>
    <ket-viewer :vector="singlet" />
    <h1>Ket List</h1>
    <ket-list :steps="steps" />
    <h1>Ket List Quantum Computing</h1>
    <ket-list :steps="stepsQuantumComputing" />
    <h1>beamSplitter 50/50</h1>
    <matrix-viewer :operator-raw="operator" />
    <h1>Pauli Z operator for spin</h1>
    <matrix-viewer :operator-raw="operator2" />
    <h1>Another example</h1>
    <matrix-viewer :operator-raw="operator3" />
    <h1>Sugar Solution</h1>
    <matrix-viewer :operator-raw="opSugar" />
    <h1>Mirror</h1>
    <matrix-viewer :operator-raw="opMirror" />
    <h1>CNOT gate</h1>
    <matrix-viewer :operator-raw="opCNOT" />
    <h1>Toffoli gate</h1>
    <matrix-viewer :operator-raw="opToffoli" />
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
