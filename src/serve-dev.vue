<script lang="ts">
import { defineComponent, ComponentInternalInstance } from 'vue';
import {
  Photons, Vector, Operator, Elements, Dimension, Cx, Gates, Circuit,
} from 'quantum-tensors';
import { KetViewer, MatrixViewer } from '@/entry';
import KetList from './lib-components/ket-list-viewer.vue';
import Ket from './lib-components/ket.vue';
import { ComplexPalette, colorComplex } from './lib-components/colors';

const sizeX = 8;
const sizeY = 8;
const state = Photons.emptySpace(sizeX, sizeY);

state.addPhotonFromIndicator(0, 2, '>', 'H');
state.updateOperators([{ x: 0, y: 2, op: Elements.beamSplitter(135) }]);
const state0 = state.copy();
state.actOnSinglePhotons();
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

const opAnd = Operator.fromSparseCoordNames([
  ['0', '00', Cx(1)],
  ['0', '01', Cx(1)],
  ['0', '10', Cx(1)],
  ['1', '11', Cx(1)],
],
[Dimension.position(2, 'bit')],
[Dimension.position(2, 'bit'), Dimension.position(2, 'bit')]);

const opCopy = Operator.fromSparseCoordNames([
  ['00', '0', Cx(1)],
  ['11', '1', Cx(1)],
],
[Dimension.position(2, 'bit'), Dimension.position(2, 'bit')],
[Dimension.position(2, 'bit')]);

function drawPaletteGradient(canvas: HTMLCanvasElement, palette: ComplexPalette) {
  const w = 400;
  const h = 50;

  // eslint-disable-next-line no-param-reassign
  canvas.width = w;
  // eslint-disable-next-line no-param-reassign
  canvas.height = h;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  for (let x = 0; x < w; x += 1) {
    const arg = (x / w) * 2 * Math.PI;
    const re = Math.cos(arg);
    const im = Math.sin(arg);
    ctx.fillStyle = colorComplex(re, im, palette);
    ctx.fillRect(x, 0, 1, h);
  }
}

export default defineComponent({
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
      opAnd,
      opCopy,
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
  methods: {
    drawPalette(palette: ComplexPalette) {
      return (canvas: Element | ComponentInternalInstance | null) => {
        drawPaletteGradient(canvas as HTMLCanvasElement, palette);
      };
    },
  },
});
</script>

<template>
  <h1>AND</h1>
  <matrix-viewer :operator="opAnd" />
  <h1>COPY</h1>
  <matrix-viewer
    :operator="opCopy"
    :show-legend="false"
  />
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
  <div class="bright2">
    <h1>Ket Viewer (short)</h1>
    <ket-viewer
      :style="{width: '200px'}"
      :vector="state.vector"
      :dark-mode="false"
    />
  </div>
  <h1>Ket Viewer for a singlet state</h1>
  <ket-viewer :vector="singlet" />
  <h1>Ket List</h1>
  <ket-list :steps="steps" />
  <div class="bright">
    <h1>Ket List</h1>
    <ket-list
      :steps="steps"
      :dark-mode="false"
    />
  </div>
  <h1>Ket List Quantum Computing</h1>
  <ket-list :steps="stepsQuantumComputing" />
  <div class="bright">
    <h1>beamSplitter 50/50</h1>
    <matrix-viewer
      :operator="operator"
      :dark-mode="false"
    />
  </div>
  <h1>beamSplitter 50/50</h1>
  <matrix-viewer :operator="operator" />
  <h1>Pauli Z operator for spin</h1>
  <matrix-viewer :operator="operator2" />
  <h1>Another example</h1>
  <matrix-viewer :operator="operator3" />
  <h1>Sugar Solution</h1>
  <matrix-viewer :operator="opSugar" />
  <h1>Mirror</h1>
  <matrix-viewer :operator="opMirror" />
  <h1>CNOT gate</h1>
  <matrix-viewer :operator="opCNOT" />
  <h1>Toffoli gate</h1>
  <matrix-viewer :operator="opToffoli" />
  <h1>Color palettes</h1>
  <h2>Hsl</h2>
  <canvas :ref="drawPalette('hsl')" />
  <h2>cubehelix</h2>
  <canvas :ref="drawPalette('cubehelix')" />
  <h2>Oklab</h2>
  <canvas :ref="drawPalette('oklab')" />
</template>
<!-- eslint-disable-next-line vue-scoped-css/require-scoped -->
<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
}

#app {
  // background-color: rgb(255, 255, 255);
  background-color: #242424; //GREY
  // background-color: #210235; //QG DARK PURPLE
  // background-color: #2e006a; //QG BRIGHT PURPLE
  padding-left: 80px;
  padding-top: 30px;
}
</style>
<style lang="scss" scoped>
@import "./style-variables.scss";

.bright {
  padding: 30px;
  max-width: 700px;
  background-color: rgb(243, 243, 243);
  & h1{
    color:black;
    border-top: 1px solid rgba(0, 0, 0, 0.6);
  }
}
.bright2 {
  padding: 30px;
  max-width: 700px;
  background-color: rgb(255, 255, 255);
  & h1{
    color:rgb(24, 24, 24);
    border-top: 1px solid rgba(0, 0, 0, 0.6);
  }
}

h1 {
  font-family: $mainFont;
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

h2 {
  font-family: $mainFont;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}
</style>
