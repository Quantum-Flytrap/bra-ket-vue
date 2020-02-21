<template>
  <div
    ref="wrapper"
    class="ket-viewer"
  >
    <div
      v-if="showTable"
      class="btn-group"
    >
      <view-button-group
        :options="['polar', 'cartesian', 'color']"
        @selected="selectedOption = $event"
      />
    </div>
    <div class="quantum-state-viewer">
      <span
        v-for="(ketComponent, index) in ketComponents"
        :key="`ket-component-${index}`"
        class="ket-component"
      >
        <span
          v-if="selectedOption === 'polar'"
          class="ket-complex"
        >
          {{ renderComplexPolar(ketComponent.amplitude) }}
        </span>
        <span
          v-if="selectedOption === 'cartesian'"
          class="ket-complex"
        >
          {{ renderComplexCartesian(ketComponent.amplitude) }}
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
          >{{ coordStr }}</span>
          <span class="ket-parenthesis">⟩</span>
        </span>
      </span>
    </div>
    <div v-if="showLegend">
      <coordinate-legend
        class="legend"
        :selected-option="selectedOption"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import {
  Complex, Vector, VectorEntry, Basis,
} from 'quantum-tensors';
import { hslToHex, TAU } from '@/lib-components/colors';
import CoordinateLegend from '@/lib-components/coordinate-legend.vue';
import ViewButtonGroup from '@/lib-components/view-button-group.vue';

interface IKetComponent {
  amplitude: Complex;
  coordStrs: string[];
}

@Component({
  components: {
    CoordinateLegend,
    ViewButtonGroup,
  },
})

export default class KetViewer extends Vue {
  @Prop() readonly vector!: Vector

  @Prop({ default: true }) readonly showLegend!: boolean

  @Prop({ default: true }) readonly showTable!: boolean

  @Prop({ default: 'polar' }) readonly selectedOption!: string

  @Prop({ default: 'HV' }) readonly selectedPolBasis!: string

  options = ['polar', 'cartesian', 'color']

  get dimensionNames(): string[] {
    return this.vector.names;
  }

  toPercent(x: number, precision = 1): string {
    return (100 * x).toFixed(precision);
  }

  renderComplexPolar(z: Complex, precision = 2): string {
    return `${z.r.toFixed(precision)} exp(i${z.phi.toFixed(precision)})`;
  }

  renderComplexCartesian(z: Complex, precision = 2): string {
    return `(${z.re.toFixed(precision)} + i${z.im.toFixed(precision)})`;
  }

  discScale(r: number): number {
    return 8 * r;
  }

  complexToColor(z: Complex): string {
    const angleInDegrees = ((z.arg() * 360) / TAU + 360) % 360;
    return hslToHex(angleInDegrees, 100, 50);
  }

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
  }

  get ketComponents(): IKetComponent[] {
    const probThreshold = 1e-4;
    const basis = Basis.polarization(this.selectedPolBasis);
    return basis.changeAllDimsOfVector(this.vector).entries
      .map((entry: VectorEntry): IKetComponent => ({
        amplitude: entry.value,
        coordStrs: entry.coord.map((c: number, dim: number) => this.vector.coordNames[dim][c]),
      }))
      .filter((d) => d.amplitude.r ** 2 > probThreshold);
  }
}
</script>

<style lang="scss" scoped>
.ket-viewer {
  padding-top: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  transition: height 0.5s;
  overflow: hidden;
  align-content: space-between;
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
  & .hidebutton {
    font-size: 12px;
  }
  & .quantum-state-viewer {
    font-weight: 500;
    display: flex;
    flex-wrap: wrap;
    & .controls {
      font-size: 12px;
      color: white;
      padding: 10px;
    }
    & .absorptions {
      font-size: 12px;
      color: white;
      padding: 10;
      margin: 10px;
    }
    & .ket-component {
      background-color: rgba(0, 0, 0, 0.3);
      margin: 5px;
      line-height: 1.4rem;
      font-size: 14px;
      flex-wrap: nowrap;
      flex-direction: row;
      display: flex;
      align-items: center;
      & .ket-complex {
        color: #9d40ff;
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
  & .btn-group {
    text-align: center;
    display: flex;
    max-width: 100%;
    margin-bottom: 5px;
    margin-bottom: 10px;
    padding: 5px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  }
  @media screen and (max-width: 1000px) {
    border: none;
  }
}
.legend {
  margin-top: 5px;
  border-top: 1px solid rgba(255, 255, 255, 0.5);
}

.step {
  font-size: 12px;
  line-height: 150%;
}

h3 {
  font-size: 1rem;
}

</style>
