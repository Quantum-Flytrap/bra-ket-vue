# bra-ket-vue

[![npm version](https://badge.fury.io/js/bra-ket-vue.svg)](https://badge.fury.io/js/bra-ket-vue)
![License](https://img.shields.io/npm/l/bra-ket-vue)
[![Build Status](https://travis-ci.com/Quantum-Game/bra-ket-vue.svg?branch=master)](https://travis-ci.com/Quantum-Game/bra-ket-vue)
[![Twitter @QuantumGameIO](https://img.shields.io/twitter/follow/QuantumGameIO)](https://twitter.com/quantumgameio)

A visualizer for quantum states and matrices. In Vue.js.
See [live examples with code](https://codesandbox.io/s/bra-ket-vue-cydtt), or just [live examples](https://cydtt.csb.app/).

By [Piotr Migdał](https://p.migdal.pl/) (quantum physics & programming) and [Klem Jankiewicz](http://jankiewiczstudio.com/) (UX & design).

* Uses [Quantum Tensors](https://www.npmjs.com/package/quantum-tensors) library.
* A separated part of [Quantum Game 2](https://github.com/Quantum-Game/quantum-game-2) (developed at the [Centre for Quanutum Technologies, National University of Sinagpore](https://www.quantumlah.org/)) we use it heavily.
* Founded by the [Unitary Fund](https://unitary.fund/).

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
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.17/vue.js"></script>
<script src="https://unpkg.com/quantum-tensors@0.4.7/dist/quantum-tensors.min.js"></script>
<script src="https://unpkg.com/bra-ket-vue@0.3.0/dist/bra-ket-vue.min.js"></script>
```

For some applications you may want to read a bit about [Vue.js](https://vuejs.org/).

## Examples

Here are examples in the dark style. All components are aviable in two styles: dark and bright.

### States (vectors)

![Ket list for quantum computing](imgs/quantum_computing.png)

![Ket list for quantum optics](imgs/ket_list.png)

### Operators (matrices)

![Matrix - beam-spliutter](imgs/beam_splitter.png)

![Matrix - CNOT gate](imgs/cnot_gate.png)

### Live examples with code

* NPM examples:
  * https://codesandbox.io/s/bra-ket-vue-cydtt - for a short overview
  * DARK color mode example: https://codesandbox.io/s/bra-ket-vue-dark-6zr46?fontsize=14&hidenavigation=1&theme=dark
  * BRIGHT color mode example: https://codesandbox.io/s/bra-ket-vue-dark-l88er?fontsize=14&hidenavigation=1&theme=dark
* A frontend JavaScript examples:
  * https://jsfiddle.net/stared/1Lbuoxte/ - for the first example
* In-action:
  * [Quantum Game with Photons 2](https://quantumgame.io/), especially entries of the element encyclopedia (e.g. [Faraday rotator](https://quantumgame.io/info/faraday-rotator)).

## Notes

This repo was created using a script [vue-sfc-rollup](https://www.npmjs.com/package/vue-sfc-rollup)  (a Vue component library generator, for JavaScript and TypeScript).

For more, see [packaging Vue v2 Components for npm](https://vuejs.org/v2/cookbook/packaging-sfc-for-npm.html) in the official Vue documentation.
