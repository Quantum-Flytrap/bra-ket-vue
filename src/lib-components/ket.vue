<template>
  <div
    ref="wrapper"
    class="ket"
  >
    <div class="quantum-state-viewer">
      <span
        v-for="(ketComponent, index) in ketComponents"
        :key="`ket-component-${index}`"
        class="ket-component"
      >
        <span
          v-if="selectedOption !== 'color'"
          class="ket-complex"
        >
          {{ ketComponent.amplitude.toString(selectedOption) }}
        </span>
        <svg
          v-if="selectedOption === 'color'"
          height="16"
          width="16"
          class="ket-disk"
        >
          <circle
            cx="8"
            cy="8"
            :r="discScale(ketComponent.amplitude.r)"
            :fill="complexToColor(ketComponent.amplitude)"
          />
        </svg>
        <span class="ket-ket">
          <span class="ket-parenthesis">|</span>
          <span
            v-for="(coordStr, i) in ketComponent.coordStrs"
            :key="`ket-component-${i}-${coordStr}`"
            class="ket-coord"
            :style="{ color: dimensionNameToColor(dimensionNames[i]) }"
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
  Dimension, Complex, Vector, VectorEntry, Basis,
} from 'quantum-tensors';
import { coordPrettier } from '@/lib-components/utils';
import { hslToHex, TAU } from '@/lib-components/colors';

interface IKetComponent {
  amplitude: Complex;
  coordStrs: string[];
}

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
  },
  computed: {

    dimensionNames(): string[] {
      return this.vector.names;
    },

    ketComponents(): IKetComponent[] {
      if (!this.vector) {
        return [];
      }
      const probThreshold = 1e-4;
      const basisPol = Basis.polarization(this.allBases.filter((d) => d.name === 'polarization')[0].selected);
      const basisSpin = Basis.spin(this.allBases.filter((d) => d.name === 'spin')[0].selected);
      const basisQubit = Basis.qubit(this.allBases.filter((d) => d.name === 'qubit')[0].selected);
      const rotatedVector = basisQubit.changeAllDimsOfVector(
        basisSpin.changeAllDimsOfVector(basisPol.changeAllDimsOfVector(this.vector)),
      );
      return rotatedVector.entries
        .map((entry: VectorEntry): IKetComponent => ({
          amplitude: entry.value,
          coordStrs: entry.coord.map((c: number, dim: number) => rotatedVector.coordNames[dim][c]),
        }))
        .filter((d) => d.amplitude.r ** 2 > probThreshold);
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

    dimensionNameToColor(dimName: string): string {
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
    },
  },
});
</script>

<style lang="scss" scoped>
.ket {
  display: flex;
  transition: height 0.5s;
  overflow: hidden;
  align-content: space-between;
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
  & .quantum-state-viewer {
    display: flex;
    flex-wrap: wrap;
    font-size: 12px;
    & .ket-component {
      background-color: rgba(0, 0, 0, 0.3);
      margin: 5px;
      line-height: 1.4rem;
      flex-wrap: nowrap;
      flex-direction: row;
      display: flex;
      align-items: center;
      & .ket-complex {
        color: #d28fff;
        padding: 0px 0px 0px 6px;
      }
      & .ket-disk {
        margin-left: 5px;
      }
      & .ket-ket {
        color: #fff;
        padding: 0px 6px;
        margin: 2px;
        & .ket-parenthesis {
          padding: 0px;
        }
        & .ket-coord {
          padding: 2px;
        }
      }
    }
  }
}
</style>
