<template>
  <div
    ref="wrapper"
    class="ket"
  >
    <!-- DARK MODE -->
    <div
      v-if="darkMode === true"
      class="quantum-state-viewer"
    >
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
            :style="{ color: dimensionNameToColor(dimensionNames[i], true) }"
          >{{ coordPrettier(coordStr) }}</span>
          <span class="ket-parenthesis">⟩</span>
        </span>
      </span>
    </div>
    <!-- BRIGHT MODE -->
    <div
      v-if="darkMode === false"
      class="quantum-state-viewer"
    >
      <span
        v-for="(ketComponent, index) in ketComponents"
        :key="`ket-component-${index}`"
        class="ket-component-bright"
      >
        <span
          v-if="selectedOption !== 'color'"
          class="ket-complex-bright"
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
        <span class="ket-ket-bright">
          <span class="ket-parenthesis">|</span>
          <span
            v-for="(coordStr, i) in ketComponent.coordStrs"
            :key="`ket-component-${i}-${coordStr}`"
            class="ket-coord"
            :style="{ color: dimensionNameToColor(dimensionNames[i], false) }"
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
  Dimension, Complex, Vector, VectorEntry,
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
    darkMode: {
      type: Boolean,
      default: true,
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
      const selectedBasis: Record<string, string> = {};
      this.allBases.forEach((basis) => {
        selectedBasis[basis.name] = basis.selected;
      });

      return this.vector
        .toBasisAll('polarization', selectedBasis.polarization)
        .toBasisAll('spin', selectedBasis.spin)
        .toBasisAll('qubit', selectedBasis.qubit)
        .entries
        .map((entry: VectorEntry): IKetComponent => ({
          amplitude: entry.value,
          coordStrs: entry.coord.map((c: number, dim: number) => this.vector.coordNames[dim][c]),
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
      margin: 5px 5px 5px 0px;
      padding: 4px 0px;
      line-height: 1rem;
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
        padding: 0px 3px;
        margin: 2px;
      }
    }
    & .ket-component-bright {
      // background-color: rgba(105, 56, 129, 0.315);
      border-width: 1px;
      border-style: solid;
      border-color: rgb(240, 240, 240);
      background-color: white;
      margin: 5px 5px 5px 0px;
      padding: 4px 0px;
      line-height: 1rem;
      flex-wrap: nowrap;
      flex-direction: row;
      display: flex;
      align-items: center;
      & .ket-complex-bright {
        color: #7a06c7;
        padding: 0px 0px 0px 6px;
      }
      & .ket-ket-bright {
        color: #242424;
        padding: 0px 3px;
        margin: 2px;
      }
    }
    & .ket-disk {
      margin-left: 5px;
    }
    & .ket-parenthesis {
      padding: 0px;
    }
    & .ket-coord {
      padding: 2px;
    }
  }
}
</style>
