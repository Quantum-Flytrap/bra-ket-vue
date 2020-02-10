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
        <span
          v-for="(particleCoord, pIndex) in ketComponent.particleCoords"
          :key="`ket-component-${pIndex}`"
          class="ket-coord"
        >
          | {{ particleCoord.x }},{{ particleCoord.y }}
          <span class="ket-dir">
            {{ renderDir(particleCoord.dir) }}
          </span>
          <span class="ket-pol">
            {{ renderPol(particleCoord.pol) }}
          </span>
          ⟩
        </span>
      </span>
    </div>
    <div v-if="showLegend && ketComponents.length > 0">
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
  Complex, Photons, VectorEntry, Vector, Ops,
} from 'quantum-tensors';
import { range } from '@/lib-components/utils';
import { hslToHex, TAU } from '@/lib-components/colors';
import CoordinateLegend from '@/lib-components/coordinate-legend.vue';
import ViewButtonGroup from '@/lib-components/view-button-group.vue';

// from interfaces.ts
interface IParticleCoord {
  kind: string // for now only 'photon'
  x: number
  y: number
  dir: number // 0: > 1: ^, 2: <. 3: v
  pol: number // 0: H, 1: V
}

// from QuantumFrame.ts
interface IKetComponent {
  amplitude: Complex
  particleCoords: IParticleCoord[]
}

function changePolBasisAll(basis: string, vec: Vector): Vector {
  let newVec = vec.copy();
  vec.dimensions.forEach((dimension, i) => {
    if (dimension.name === 'polarization' && basis === 'DA') {
      newVec = Ops.basisToDA.mulVecPartial([i], newVec);
    } else if (dimension.name === 'polarization' && basis === 'LR') {
      newVec = Ops.basisToLR.mulVecPartial([i], newVec);
    }
  });
  return newVec;
}

// from QuantumFrame.ts
const ketComponents = (photons: Photons, basis = 'HV', probThreshold = 1e-4): IKetComponent[] => {
  const ns = range(photons.nPhotons);
  return changePolBasisAll(basis, photons.vector).entries
    .map(
      (entry: VectorEntry): IKetComponent => {
        const particleCoords = ns.map(
          (i: number): IParticleCoord => {
            const [x, y, dir, pol] = entry.coord.slice(4 * i, 4 * i + 4);
            return {
              kind: 'photon', x, y, dir, pol,
            };
          },
        );
        return {
          amplitude: entry.value,
          particleCoords,
        };
      },
    )
    .filter(
      (ketComponent: IKetComponent): boolean => ketComponent.amplitude.r ** 2 > probThreshold,
    );
};

@Component({
  components: {
    CoordinateLegend,
    ViewButtonGroup,
  },
})

export default class KetViewer extends Vue {
  // TODO: Currently kinda ugly
  // TODO: Move logic to engine Helpers
  @Prop() readonly photons!: Photons

  @Prop({ default: true }) readonly showLegend!: boolean

  @Prop({ default: true }) readonly showTable!: boolean

  @Prop({ default: 'polar' }) readonly selectedOption!: string

  @Prop({ default: 'HV' }) readonly selectedPolBasis!: string

  options = ['polar', 'cartesian', 'color']

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

  renderDir(dir: number): string {
    return ['→', '↑', '←', '↓'][dir];
  }

  renderPol(pol: number): string {
    return this.selectedPolBasis[pol];
  }

  get ketComponents(): IKetComponent[] {
    return ketComponents(this.photons, this.selectedPolBasis);
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
      & .ket-coord {
        color: #fff;
        padding: 0px 6px;
        margin: 2px;
        & .ket-dir {
          color: #ff0055;
        }
        & .ket-pol {
          color: #ff9100;
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
