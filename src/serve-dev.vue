<script lang="ts">
import Vue from 'vue';
import {
  Photons, Vector, Operator, Elements, Dimension, Cx, Gates, Circuit,
} from 'quantum-tensors';
import { KetViewer, MatrixViewer } from '@/entry';
import KetList from './lib-components/ket-list-viewer.vue';
import Ket from './lib-components/ket.vue';

const sizeX = 8;
const sizeY = 8;
const state = Photons.emptySpace(sizeX, sizeY);

state.addPhotonFromIndicator(0, 2, '>', 'H');
const state0 = state.copy();
state.actOnSinglePhotons([{ x: 0, y: 2, op: Elements.beamSplitter(135) }]);
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


const circuitHistory: Circuit[] = [];
Circuit.qubits(3)
  .saveTo(circuitHistory)
  .H(0)
  .saveTo(circuitHistory)
  .CNOT(0, 1)
  .saveTo(circuitHistory)
  .TOFFOLI(0, 1, 2)
  .saveTo(circuitHistory);

export default Vue.extend({
  name: 'ServeDev',
  components: {
    KetViewer,
    MatrixViewer,
    KetList,
    Ket,
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
        { value: 'initial state', vector: circuitHistory[0].vector },
        { value: 'Haadamard on 1st qubit', vector: circuitHistory[1].vector },
        { value: 'CNOT on 1st and 2nd qubit', vector: circuitHistory[2].vector },
        { value: 'Toffoli gate on all qubits', vector: circuitHistory[3].vector },
      ],
    };
  },
});
</script>

<template>
  <div id="app">
    <h1>Ket</h1>
    <ket
      :vector="singlet"
      :dark-mode="true"
    />
    <div class="bright">
      <h1>Ket Viewer</h1>
      <ket-viewer
        :vector="state.vector"
        :dark-mode="false"
      />
    </div>
    <div class="bright2">
      <h1>Ket Viewer</h1>
      <ket-viewer
        :vector="state.vector"
        :dark-mode="false"
      />
    </div>
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
  // background-color: rgb(255, 255, 255);
  background-color: #242424; //GREY
  // background-color: #210235; //QG DARK PURPLE
  // background-color: #2e006a; //QG BRIGHT PURPLE
  padding-left: 80px;
  padding-top: 30px;
}
.bright {
  padding: 30px;
  max-width: 600px;
  background-color: rgb(240, 240, 240);
  & h1{
    color:black;
    border-top: 1px solid rgba(0, 0, 0, 0.6);
  }
}
.bright2 {
  padding: 30px;
  max-width: 600px;
  background-color: rgb(255, 255, 255);
  & h1{
    color:rgb(24, 24, 24);
    border-top: 1px solid rgba(0, 0, 0, 0.6);
  }
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
