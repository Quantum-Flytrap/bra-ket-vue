# bra-ket-vue / ⟨𝜑|𝜓⟩.vue

[![npm version](https://badge.fury.io/js/bra-ket-vue.svg)](https://badge.fury.io/js/bra-ket-vue)
![License](https://img.shields.io/npm/l/bra-ket-vue)
[![Build Status](https://travis-ci.com/Quantum-Game/bra-ket-vue.svg?branch=master)](https://travis-ci.com/Quantum-Flytrap/bra-ket-vue)
[![Twitter @QuantumGameIO](https://img.shields.io/twitter/follow/QuantumGameIO)](https://twitter.com/QuantumFlytrap)

A visualizer for quantum states and matrices. In Vue.js.
See [live examples with code](https://codesandbox.io/s/bra-ket-vue-cydtt), or just [live examples](https://cydtt.csb.app/).

By [Piotr Migdał](https://p.migdal.pl/) (quantum physics & programming) and [Klem Jankiewicz](http://jankiewiczstudio.com/) (UX & design) from [Quantum Flytrap](https://quantumflytrap.com/).

* Uses [Quantum Tensors](https://www.npmjs.com/package/quantum-tensors) library.
* A separated part of [Quantum Game 2](https://github.com/Quantum-Game/quantum-game-2) (developed at the [Centre for Quantum Technologies, National University of Sinagpore](https://www.quantumlah.org/)) and [Virtual Lab](lab.quantumflytrap.com/).
* Supported by the [Unitary Fund](https://unitary.fund/).

[![Unitary Fund](https://img.shields.io/badge/Supported%20By-UNITARY%20FUND-brightgreen.svg?style=for-the-badge)](http://unitary.fund)

## Installation

For a node project use:

```{bash}
npm install bra-ket-vue
```

or for yarn:

```{bash}
yarn add bra-ket-vue
```

For browser HTML files, put in `<head>...</head>`:

```{html}
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
<script src="https://unpkg.com/quantum-tensors"></script>
<script src="https://unpkg.com/bra-ket-vue"></script>
```

Or if you want to stick to specific versions

```{html}
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.0-rc.10/vue.esm-browser.prod.js"></script>
<script src="https://unpkg.com/quantum-tensors@0.4.11/dist/quantum-tensors.min.js"></script>
<script src="https://unpkg.com/bra-ket-vue@0.4.1/dist/bra-ket-vue.min.js"></script>
```

For some applications you may want to read a bit about [Vue.js](https://vuejs.org/).

Note: up to 0.3.1 it used Vue 2. Starting from 0.4.0 it uses Vue 3.

## Examples

Here are examples in the dark style. All components are available in two styles: dark and bright.
By default we use the dark style.
Each `vector` is a `Vector` object from Quantum Tensors, and each `operator` is an `Operator` object.

### States (vectors)

![Ket list for quantum computing](imgs/quantum_computing.png)

![Ket list for quantum optics](imgs/ket_list.png)

```{html}
<ket-viewer :vector="vector" :dark-mode="true" />
```

![Ket](imgs/ket.gif)

### Operators (matrices)

```{html}
<matrix-viewer :operator="operator" :dark-mode="true" />
```

![Matrix - beam-splitter](imgs/beam_splitter.png)

![Matrix - CNOT gate](imgs/cnot_gate.png)

![Matrix - Toffoli gate](imgs/toffoli.gif)

### Live examples with code

* NPM examples:
  * https://codesandbox.io/s/bra-ket-vue-cydtt - for a short overview
  * DARK color mode example: https://codesandbox.io/s/bra-ket-vue-dark-6zr46?fontsize=14&hidenavigation=1&theme=dark
  * BRIGHT color mode example: https://codesandbox.io/s/bra-ket-vue-dark-l88er?fontsize=14&hidenavigation=1&theme=dark
* A frontend JavaScript examples
  * <https://jsfiddle.net/user/stared/fiddles/>

* In-action:
  * [Quantum Game with Photons 2](https://quantumgame.io/), especially entries of the element encyclopedia (e.g. [Faraday rotator](https://quantumgame.io/info/faraday-rotator)).
  * Presentation with Reveal.js (RISE in Jupyter Notebook): <https://p.migdal.pl/piterpy-matrix/#/17>
  * Presentation with R Markdown Raveal.js <http://p.migdal.pl/nyc-qc-braketvue/#/>
  * Distill in R Markdown: <https://p.migdal.pl/bra-ket-vue-art/>
    * [Quantum computing states and operators](https://p.migdal.pl/bra-ket-vue-art/ket.html)
    * [Classic logic operation truth tables](https://p.migdal.pl/bra-ket-vue-art/logic_operations.html)


## Notes

This repo was created using a script [vue-sfc-rollup](https://www.npmjs.com/package/vue-sfc-rollup)  (a Vue component library generator, for JavaScript and TypeScript).

For more, see [packaging Vue v2 Components for npm](https://vuejs.org/v2/cookbook/packaging-sfc-for-npm.html) in the official Vue documentation.
