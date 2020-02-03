<script lang="ts">
import Vue from 'vue';
import {
  Photons, Operator, Elements, Dimension,
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
      operator2: Operator.identity([Dimension.spin()]),
      operator3: Operator.identity([Dimension.spin(), Dimension.position(3, 'energy'), Dimension.polarization()]),
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
    <ket-list :photons="state" />
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
