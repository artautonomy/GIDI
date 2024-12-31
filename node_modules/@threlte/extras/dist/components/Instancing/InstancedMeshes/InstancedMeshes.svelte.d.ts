import type { InstancedMeshesProps, Meshes } from './types';
declare class __sveltets_Render<T extends Meshes> {
    props(): InstancedMeshesProps<T>;
    events(): {};
    slots(): {};
    bindings(): "";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <T extends Meshes>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<T>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<T>['props']>, ReturnType<__sveltets_Render<T>['events']>, ReturnType<__sveltets_Render<T>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<T>['bindings']>;
    } & ReturnType<__sveltets_Render<T>['exports']>;
    <T extends Meshes>(internal: unknown, props: ReturnType<__sveltets_Render<T>['props']> & {}): ReturnType<__sveltets_Render<T>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const InstancedMeshes: $$IsomorphicComponent;
type InstancedMeshes<T extends Meshes> = InstanceType<typeof InstancedMeshes<T>>;
export default InstancedMeshes;
