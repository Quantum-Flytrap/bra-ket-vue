<script lang="ts">
import Vue from 'vue';
import {
  Photons, OperatorEntry, Operator, Elements,
} from 'quantum-tensors';
import { KetViewer, QuantumMatrix } from '@/entry';
// import CoordinateLegend from './lib-components/coordinate-legend.vue';
// import ViewerButton from './lib-components/viewer-button.vue';
import KetList from './lib-components/ket-list-viewer.vue';

const sizeX = 8;
const sizeY = 8;
const state = new Photons(sizeX, sizeY);
state.addPhotonIndicator(0, 2, '>', 'H');
const operations: [number, number, Operator][] = [[0, 2, Elements.beamSplitter(135)]];
state.actOnSinglePhotons(operations);

interface IMatrixElement {
  i: number
  j: number
  re: number
  im: number
}

export default Vue.extend({
  name: 'ServeDev',
  components: {
    KetViewer,
    QuantumMatrix,
    // CoordinateLegend,
    // ViewerButton,
    KetList,
  },
  data() {
    return {
      state,
      operator: Elements.beamSplitter(45),
      dirPolOrder: true,
    };
  },
  // a lot from EncyclopediaTransition.vue
  computed: {
    coordNames(): string[][] {
      const coordsDir = ['→', '↑', '←', '↓'];
      const coordsPol = ['H', 'V'];
      return this.dirPolOrder ? [coordsDir, coordsPol] : [coordsPol, coordsDir];
    },
    dimensionNames(): string[] {
      return this.dirPolOrder ? ['direction', 'polarization'] : ['polarization', 'direction'];
    },
    matrixElements(): IMatrixElement[] {
      if (this.dirPolOrder) {
        return this.operator.entries.map((entry: OperatorEntry) => ({
          i: 2 * entry.coordIn[0] + entry.coordIn[1],
          j: 2 * entry.coordOut[0] + entry.coordOut[1],
          re: entry.value.re,
          im: entry.value.im,
        }));
      }
      return this.operator.entries.map((entry: OperatorEntry) => ({
        i: entry.coordIn[0] + 4 * entry.coordIn[1],
        j: entry.coordOut[0] + 4 * entry.coordOut[1],
        re: entry.value.re,
        im: entry.value.im,
      }));
    },
  },
});
</script>

<template>
  <div id="app">
    <ket-viewer :photons="state" />
    <quantum-matrix
        :coord-names-in="coordNames"
        :coord-names-out="coordNames"
        :dimension-names="dimensionNames"
        :matrix-elements="matrixElements"
        :size="30"
        @columnMouseover="console.log($event)"
        @swapDimensions="dirPolOrder = !dirPolOrder"
    />
    <ket-list :photons="state" />
    <div></div>
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
