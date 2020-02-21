<template>
  <div
    ref="wrapper"
    class="ket-list"
  >
    <table>
      <thead>
        <tr>
          <th class="w1">
            step
          </th>
          <th class="w2">
            value
          </th>
          <th>state</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(step, i) in steps"
          :key="`step-${i}`"
        >
          <td>{{ i }}</td>
          <td>{{ step.value }}</td>
          <td>
            <ket-viewer
              class="ket-viewer"
              :vector="step.vector"
              :show-legend="false"
              :show-table="false"
              :selected-option="selectedOption"
              :selected-pol-basis="selectedPolBasis"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <coordinate-legend
      v-if="showLegend"
      class="legend-list"
      :selected-option="selectedOption"
    />
    <div class="btn-legend-group">
      <span class="btn-legend">view</span>
      <span class="btn-legend">base change</span>
    </div>
    <div class="btn-group">
      <span>
        <view-button-group
          :options="['polar', 'cartesian', 'color']"
          @selected="selectedOption = $event"
        />
      </span>
      <span>
        <span
          v-for="basis in polBases"
          :key="`${basis}`"
          class="basis"
          @click="selectedPolBasis = basis"
        >
          {{ basis }}
        </span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Vector } from 'quantum-tensors';
import CoordinateLegend from '@/lib-components/coordinate-legend.vue';
import ViewerButton from '@/lib-components/viewer-button.vue';
import ViewButtonGroup from '@/lib-components/view-button-group.vue';
import KetViewer from '@/lib-components/ket-viewer.vue';

@Component({
  components: {
    CoordinateLegend,
    ViewerButton,
    ViewButtonGroup,
    KetViewer,
  },
})

export default class KetList extends Vue {
  @Prop() readonly steps!: {value: number, vector: Vector}[]

  @Prop({ default: true }) readonly showLegend!: boolean

  options = ['polar', 'cartesian', 'color']

  selectedOption = 'polar'

  selectedPolBasis = 'HV';

  polBases = ['HV', 'DA', 'LR'];
}
</script>

<style lang="scss" scoped>
table {
  font-size: 12px;
  font-weight: 300;
  text-align: left;
  color: rgba(255, 255, 255, 0.5);
  border-collapse: separate;
  border-spacing: 10px;
}
th {
  font-weight: 300;
  text-transform: uppercase;
}
td {
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}
.w1 {
  width: 40px;
}
.w2 {
  width: 80px;
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
  & .ket-viewer {
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
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
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

.basis {
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  color: white;
  padding: 4px 12px;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 9px;
  transition: 0.5s;
  margin: 3px;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}
</style>
