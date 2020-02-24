import Vue, { PluginFunction, VueConstructor } from 'vue';


interface InstallFunction extends PluginFunction<any> {
  installed?: boolean;
}

declare const BraKetVue: { install: InstallFunction };
export default BraKetVue;

export const Ket: VueConstructor<Vue>;
export const KetViewer: VueConstructor<Vue>;
export const MatrixViewer: VueConstructor<Vue>;
export const KetListViewer: VueConstructor<Vue>;
export const ComplexLegend: VueConstructor<Vue>;
export const CoordinateLegend: VueConstructor<Vue>;
export const MatrixDimensions: VueConstructor<Vue>;
export const MatrixLabels: VueConstructor<Vue>;
export const OptionsGroup: VueConstructor<Vue>;
