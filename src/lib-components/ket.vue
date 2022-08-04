<template>
  <div
    class="quantum-state-viewer"
  >
    <span
      v-for="(ketComponent, index) in ketComponents"
      :key="`ket-component-${index}`"
      :class="ketComponentClass"
    >
      <span
        v-if="selectedOption !== 'color'"
        class="ket-complex"
      >
        {{ ketComponent.amplitude.toString(selectedOption) }}
      </span>
      <svg
        v-if="selectedOption === 'color'"
        height="1em"
        width="1em"
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
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import {
  Dimension, Complex, Vector, interfaces,
} from 'quantum-tensors';
import { coordPrettier, dimensionNameToColor } from '@/lib-components/utils';
import { colorComplex } from '@/lib-components/colors';

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

export default defineComponent({
  name: 'Ket',
  props: {
    vector: {
      type: Object as PropType<Vector>,
      default: () => Vector.indicator([Dimension.qubit()], '0'),
    },
    selectedOption: {
      type: String,
      default: 'polar',
    },
    allBases: {
      type: Array as PropType<IBasisSelector[]>,
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

      return this.allBases
        .reduce((vector, basis) => vector.toBasisAll(basis.name, basis.selected), this.vector)
        .toKetComponents(1e-4);
    },
    ketComponentClass(): string {
      return this.darkMode ? 'ket-component-dark' : 'ket-component-bright';
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
      return colorComplex(z.re, z.im);
    },

    coordPrettier(coord: string): string {
      return coordPrettier(coord);
    },

    dimensionNameToColor(dimName: string, darkStyle: boolean): string {
      return dimensionNameToColor(dimName, darkStyle);
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../style-variables.scss";

.quantum-state-viewer {
  display: flex;
  flex-wrap: wrap;
  font-size: $fontSizeDefault;
  font-family: $ketFont;
  & .ket-component-dark, .ket-component-bright {
    margin: 2px 6px 0px 0px;
    padding: 3px 4px;
    flex-wrap: nowrap;
    flex-direction: row;
    display: flex;
    align-items: center;
    & .ket-complex {
      margin-right: 2px;
    }
    & .ket-coords {
      display: inline-flex;
    }
    & .ket-coord {
      padding-right: 1px;
      padding-right: 3px;
    }
  }
  & .ket-component-dark {
    background-color: rgba(0, 0, 0, 0.3);
    & .ket-complex {
      color: #d28fff;
    }
    & .ket-coords {
      color: #fff;
    }
  }
  & .ket-component-bright {
    border-width: 1px;
    border-style: solid;
    border-color: rgb(240, 240, 240);
    background-color: white;
    & .ket-complex {
      color: #7a06c7;
    }
    & .ket-coords {
      color: #242424;
    }
  }
}
</style>
