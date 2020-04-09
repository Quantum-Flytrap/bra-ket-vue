# bra-ket-vue

[![npm version](https://badge.fury.io/js/bra-ket-vue.svg)](https://badge.fury.io/js/bra-ket-vue)
![License](https://img.shields.io/npm/l/bra-ket-vue)
[![Build Status](https://travis-ci.com/Quantum-Game/bra-ket-vue.svg?branch=master)](https://travis-ci.com/Quantum-Game/bra-ket-vue)
[![Twitter @QuantumGameIO](https://img.shields.io/twitter/follow/QuantumGameIO)](https://twitter.com/quantumgameio)

A visualizer for quantum states and matrices. In Vue.js.
See [live examples with code](https://codesandbox.io/s/bra-ket-vue-cydtt), or just [live examples](https://cydtt.csb.app/).

By [Piotr Migdał](https://p.migdal.pl/) (quantum physics & programming) and [Klem Jankiewicz](http://jankiewiczstudio.com/) (UX & design).

* Uses [Quantum Tensors](https://www.npmjs.com/package/quantum-tensors) library.
* A separated part of [Quantum Game 2](https://github.com/Quantum-Game/quantum-game-2) (developed at the [Centre for Quanutum Technologies, National University of Sinagpore](https://www.quantumlah.org/)).
* Founded by the [Unitary Fund](https://unitary.fund/).

[![Unitary Fund](https://img.shields.io/badge/Supported%20By-UNITARY%20FUND-brightgreen.svg?style=for-the-badge)](http://unitary.fund)

## Installation

```
npm install bra-ket-vue
```

Warning: it is an early alpha version. Everything can change (including core component names) at no prior notice.


## Examples

### States (vectors)

![](imgs/quantum_computing.png)

![](imgs/ket_list.png)

### Operators (matrices)

![](imgs/beam_splitter.png)

![](imgs/cnot_gate.png)

### Live examples with code

* A NPM examples:
   * https://codesandbox.io/s/bra-ket-vue-cydtt - for a short overview
* A frontend JavaScript examples:
    * https://jsfiddle.net/stared/1Lbuoxte/ - for the first example
* DARK color mode example:
    * https://codesandbox.io/s/bra-ket-vue-dark-6zr46?fontsize=14&hidenavigation=1&theme=dark
* BRIGHT color mode example:
    * https://codesandbox.io/s/bra-ket-vue-dark-l88er?fontsize=14&hidenavigation=1&theme=dark


## Notes

This repo was created using a script [vue-sfc-rollup](https://www.npmjs.com/package/vue-sfc-rollup)  (a Vue component library generator, for JavaScript and TypeScript).

For more, see [packaging Vue v2 Components for npm](https://vuejs.org/v2/cookbook/packaging-sfc-for-npm.html) in the official Vue documentation.
