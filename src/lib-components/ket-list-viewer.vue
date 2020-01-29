<template>
  <div ref="wrapper" class="ket-list" :class="{ ketHidden: ketHidden }">
  <table>
    <thead>
      <tr>
        <th>NO</th>
        <th>EIGENVALUE</th>
        <th>EIGENVECTOR</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>01</td>
        <td>0.104</td>
        <td>
          <!-- VIEWER -->
          <div class="quantum-state-viewer">
            <span
              v-for="(ketComponent, index) in ketComponents"
              :key="`ket-component-${index}`"
              class="ket-component"
            >
              <span v-if="selectedStyle === 'polar'" class="ket-complex">
                {{ renderComplexPolar(ketComponent.amplitude) }}
              </span>
              <span v-if="selectedStyle === 'cartesian'" class="ket-complex">
                {{ renderComplexCartesian(ketComponent.amplitude) }}
              </span>
              <svg v-if="selectedStyle === 'color'" height="16" width="16" class="ket-disk">
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
          <!-- VIEWER END -->
        </td>
      </tr>
      <tr>
        <td>02</td>
        <td>0.302</td>
        <td>
          <!-- VIEWER -->
          <div class="quantum-state-viewer">
            <span
              v-for="(ketComponent, index) in ketComponents"
              :key="`ket-component-${index}`"
              class="ket-component"
            >
              <span v-if="selectedStyle === 'polar'" class="ket-complex">
                {{ renderComplexPolar(ketComponent.amplitude) }}
              </span>
              <span v-if="selectedStyle === 'cartesian'" class="ket-complex">
                {{ renderComplexCartesian(ketComponent.amplitude) }}
              </span>
              <svg v-if="selectedStyle === 'color'" height="16" width="16" class="ket-disk">
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
          <!-- VIEWER END -->
        </td>
      </tr>
    </tbody>
  </table>

    <!-- <span class="hidebutton" @click="toggleKets"
      >{{ ketHidden ? 'EXPAND' : 'COLLAPSE' }} SIMULATION INFO</span
    > -->
    <!-- LEGEND -->
    <div v-if="showLegend && ketComponents.length > 0" class="legend-list">
      <coordinate-legend :selected-style="selectedStyle"/>
    </div>
    <!-- LEGEND END -->
    <!-- BUTTONS -->
    <div class="btn-legend-group">
      <span class="btn-legend">view</span>
      <span class="btn-legend">base change</span>
    </div>
    <div class="btn-group">
      <span>
        <view-button-group @selected="selectedStyle = $event"/>
      </span>
      <span>
        <viewer-button type=icon>→  ↑</viewer-button>
        <viewer-button type=icon>↖ ↗</viewer-button>
        <viewer-button type=icon>↺  ↻</viewer-button>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Complex, Photons, VectorEntry } from 'quantum-tensors';
import { range } from '@/lib-components/utils';
import { hslToHex, TAU } from '@/lib-components/colors';
import CoordinateLegend from '@/lib-components/coordinate-legend.vue';
import ViewerButton from '@/lib-components/viewer-button.vue';
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

// from QuantumFrame.ts
const ketComponents = (photons: Photons, probThreshold = 1e-4): IKetComponent[] => {
  const ns = range(photons.nPhotons);
  return photons.vector.entries
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
    ViewerButton,
    ViewButtonGroup,
  },
})

export default class KetList extends Vue {
  // TODO: Currently kinda ugly
  // TODO: Move logic to engine Helpers
  @Prop() readonly photons!: Photons

  // @Prop() readonly grid!: Grid
  @Prop({ default: true }) readonly showLegend!: boolean

  ketHidden = true

  styles = ['polar', 'cartesian', 'color']

  selectedStyle = 'polar'

  toggleKets(): void {
    this.ketHidden = !this.ketHidden;
  }

  toPercent(x: number, precision = 1): string {
    return (100 * x).toFixed(precision);
  }

  //   elementName(x: number, y: number): string {
  //     return x === -1 && y === -1 ? 'OutOfBoard' : this.grid.cellFromXY(x, y).element.name
  //   }

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
    return ['H', 'V'][pol];
  }

  //   get absorptions(): IAbsorption[] {
  //     return this.frame.absorptions
  //   }

  get ketComponents(): IKetComponent[] {
    return ketComponents(this.photons);
  }
}
</script>

<style lang="scss" scoped>
table {
  //border-bottom: 1px solid rgba(255, 255, 255, 1);
  font-size: 12px;
  font-weight: 300;
  text-align: left;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  border-collapse: separate;
  border-spacing: 10px;
}
th {
  font-weight: 300;
}
td {
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}
.ket-list {
  padding-top: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: left;
  transition: height 0.5s;
  overflow: hidden;
  align-content: space-between;
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
  & .hidebutton {
    font-size: 0.8rem;
  }
  & .quantum-state-viewer {
    font-weight: 500;
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
    & .controls {
      font-size: 0.8rem;
      color: white;
      padding: 10px;
    }
    & .absorptions {
      font-size: 0.8rem;
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
        padding: 1px;
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
  & .btn-legend-group {
    display: flex;
    justify-content: space-between;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 1);
    margin: 0px 10px;
  }
  & .btn-legend {
    font-size: 12px;
    font-weight: 300;
    //text-align: left;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    //width: 100%;
  }
  & .btn-group {
    text-align: center;
    display: flex;
    justify-content: space-between;
    padding-top: 10px;
    margin: 0px 10px;
  }
  & .legend-list {
    margin: 0px 10px;
    border-top: 1px solid rgba(255, 255, 255, 1);
  }
  @media screen and (max-width: 1000px) {
    border: none;
  }
}

.step {
  font-size: 0.8rem;
  line-height: 150%;
}

h3 {
  font-size: 1rem;
}
</style>
