import Vue, { PluginFunction, VueConstructor } from 'vue';


interface InstallFunction extends PluginFunction<any> {
  installed?: boolean;
}

declare const BraKetVue: { install: InstallFunction };
export default BraKetVue;

export const BraKetVueSample: VueConstructor<Vue>;
