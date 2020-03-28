<template>
  <div
    ref="wrapper"
    class="ket"
  >
    <div
      class="quantum-state-viewer"
    >
      <span
        v-for="(ketComponent, index) in ketComponents"
        :key="`ket-component-${index}`"
        :class="ketComponentClass(darkMode)"
      >
        <span
          v-if="selectedOption !== 'color'"
          class="ket-complex"
        >
          {{ ketComponent.amplitude.toString(selectedOption) }}
        </span>
        <svg
          v-if="selectedOption === 'color'"
          height="100%"
          width="100%"
          viewBox="0 0 16 16"
          class="ket-disk"
        >
          <circle
            cx="8"
            cy="8"
            :r="discScale(ketComponent.amplitude.r)"
            :fill="complexToColor(ketComponent.amplitude)"
          />
        </svg>
        <span class="ket-coords">
          <span class="ket-parenthesis">|</span>
          <span
            v-for="(coordStr, i) in ketComponent.coordStrs"
            :key="`ket-component-${i}-${coordStr}`"
            class="ket-coord"
            :style="{ color: dimensionNameToColor(dimensionNames[i], darkMode) }"
          >{{ coordPrettier(coordStr) }}</span>
          <span class="ket-parenthesis">⟩</span>
        </span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  Dimension, Complex, Vector, interfaces,
} from 'quantum-tensors';
import { coordPrettier } from '@/lib-components/utils';
import { hslToHex, TAU } from '@/lib-components/colors';

interface IBasisSelector {
    name: string;
    availableBases: string[];
    selected: string;
}

const allBasesDefault: IBasisSelector[] = [
  { name: 'polarization', availableBases: ['HV', 'DA', 'LR'], selected: 'HV' },
  { name: 'spin', availableBases: ['spin-x', 'spin-y', 'spin-z'], selected: 'spin-z' },
  { name: 'qubit', availableBases: ['01', '+-', '+i-i'], selected: '01' },
];

export default Vue.extend({
  props: {
    vector: {
      type: Object as () => Vector,
      default: () => Vector.indicator([Dimension.qubit()], '0'),
    },
    selectedOption: {
      type: String,
      default: 'polar',
    },
    allBases: {
      type: Array as () => IBasisSelector[],
      default: () => allBasesDefault,
    },
    darkMode: {
      type: Boolean,
      default: true,
    },
  },
  computed: {

    dimensionNames(): string[] {
      return this.vector.names;
    },

    ketComponents(): interfaces.IKetComponent[] {
      if (!this.vector) {
        return [];
      }
      const selectedBasis: Record<string, string> = {};
      this.allBases.forEach((basis) => {
        selectedBasis[basis.name] = basis.selected;
      });

      return this.vector
        .toBasisAll('polarization', selectedBasis.polarization)
        .toBasisAll('spin', selectedBasis.spin)
        .toBasisAll('qubit', selectedBasis.qubit)
        .toKetComponents(1e-4);
    },
  },
  methods: {

    toPercent(x: number, precision = 1): string {
      return (100 * x).toFixed(precision);
    },

    discScale(r: number): number {
      return 8 * r;
    },

    complexToColor(z: Complex): string {
      const angleInDegrees = ((z.arg() * 360) / TAU + 360) % 360;
      return hslToHex(angleInDegrees, 100, 50);
    },

    coordPrettier(coord: string): string {
      return coordPrettier(coord);
    },

    ketComponentClass(darkStyle = true): string {
      if (darkStyle) {
        return 'ket-component-dark';
      }
      return 'ket-component-bright';
    },

    dimensionNameToColor(dimName: string, darkStyle = false): string {
      if (darkStyle) {
        switch (dimName) {
          case 'direction':
            return '#ff0055';
          case 'polarization':
            return '#ff9100';
          case 'spin':
            return '#0091ff';
          default:
            return '#ffffff';
        }
      } else {
        switch (dimName) {
          case 'direction':
            return '#ff0055';
          case 'polarization':
            return '#ff9100';
          case 'spin':
            return '#0091ff';
          default:
            return '#242424';
        }
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../style-variables.scss";

.ket {
  display: flex;
  transition: height 0.5s;
  overflow: hidden;
  align-content: space-between;
  font-family: $ketFont;
  & .quantum-state-viewer {
    display: flex;
    flex-wrap: wrap;
    font-size: 12px;
    & .ket-component-dark {
      background-color: rgba(0, 0, 0, 0.3);
      margin: 2px 6px 0px 0px;
      padding: 3px 4px;
      flex-wrap: nowrap;
      flex-direction: row;
      display: flex;
      align-items: center;
      & .ket-complex {
        color: #d28fff;
        margin-right: 2px;
      }

      & .ket-coords {
        display: inline-flex;
        color: #fff;
      }
      & .ket-coord {
        padding-right: 1px;
        padding-right: 3px;
      }
    }
    & .ket-component-bright {
      border-width: 1px;
      border-style: solid;
      border-color: rgb(240, 240, 240);
      background-color: white;
      margin: 2px 6px 0px 0px;
      padding: 3px 4px;
      flex-wrap: nowrap;
      flex-direction: row;
      display: flex;
      align-items: center;
      & .ket-complex {
        color: #7a06c7;
        margin-right: 2px;
      }
      & .ket-coords {
        display: inline-flex;
        color: #242424;
      }
      & .ket-coord {
        padding-right: 1px;
        padding-right: 3px;
        color: #242424;
      }
    }
    & .ket-parenthesis {
      padding: 0px;
    }
  }
}
</style>
