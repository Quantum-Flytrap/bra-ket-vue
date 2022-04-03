<script setup lang="ts">
import { Dimension, Vector, Cx, Elements } from "quantum-tensors";
import { KetViewer, MatrixViewer } from "bra-ket-vue";

defineProps<{ msg: string }>()

const singlet = Vector.fromSparseCoordNames(
  [["ud", Cx(1)], ["du", Cx(-1)]],
  [Dimension.spin(), Dimension.spin()]
).normalize();

const operator = Elements.beamSplitter(45);

</script>

<template>
  <h1>{{ msg }}</h1>

  <h2>Ket visualizer - a singlet state for spin</h2>
  <KetViewer :vector="singlet" :dark-mode="false" />

  <h2>Operator visualizer - a non-polarizing beamsplitter unitary operator</h2>
  <MatrixViewer :operator="operator" :dark-mode="false" />
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
