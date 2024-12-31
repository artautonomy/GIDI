import type { TProps } from './types';
declare class __sveltets_Render<Type> {
    props(): TProps<Type>;
    events(): {};
    slots(): {};
    bindings(): "ref";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <Type>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<Type>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<Type>['props']>, ReturnType<__sveltets_Render<Type>['events']>, ReturnType<__sveltets_Render<Type>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<Type>['bindings']>;
    } & ReturnType<__sveltets_Render<Type>['exports']>;
    <Type>(internal: unknown, props: ReturnType<__sveltets_Render<Type>['props']> & {}): ReturnType<__sveltets_Render<Type>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const T: $$IsomorphicComponent;
type T<Type> = InstanceType<typeof T<Type>>;
export default T;
