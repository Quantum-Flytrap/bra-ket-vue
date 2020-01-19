<script lang="ts">
import Vue from 'vue';
import { Photons, OperatorEntry, Operator, beamSplitter } from 'quantum-tensors';
import { KetViewer, QuantumMatrix } from '@/entry';

const sizeX = 8
const sizeY = 8
const state = new Photons(sizeX, sizeY)
state.addPhotonIndicator(0, 2, '>', 'H')
const operations: [number, number, Operator][] = [[0, 2, beamSplitter(135)]]
state.actOnSinglePhotons(operations)

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
    QuantumMatrix
  },
  data: function() {
    return {
      state: state,
      operator: beamSplitter(45),
      dirPolOrder: true
    }
  },
  // a lot from EncyclopediaTransition.vue
  computed: {
    coordNames(): string[][] {
      const coordsDir = ['⇢', '⇡', '⇠', '⇣']
      const coordsPol = ['H', 'V']
      return this.dirPolOrder ? [coordsDir, coordsPol] : [coordsPol, coordsDir]
    },
    dimensionNames(): string[] {
      return this.dirPolOrder ? ['direction', 'polarization'] : ['polarization', 'direction']
    },
    matrixElements(): IMatrixElement[] {
      if (this.dirPolOrder) {
        return this.operator.entries.map((entry: OperatorEntry) => {
          return {
            i: 2 * entry.coordIn[0] + entry.coordIn[1],
            j: 2 * entry.coordOut[0] + entry.coordOut[1],
            re: entry.value.re,
            im: entry.value.im
          }
        })
      }
      return this.operator.entries.map((entry: OperatorEntry) => {
        return {
          i: entry.coordIn[0] + 4 * entry.coordIn[1],
          j: entry.coordOut[0] + 4 * entry.coordOut[1],
          re: entry.value.re,
          im: entry.value.im
        }
      })
    }
  }
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
  </div>
</template>

<style lang="scss" scoped>
#app {
  background-color: #000000;
}
</style>

