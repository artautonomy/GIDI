import type { Material, MeshPhongMaterial, MeshStandardMaterial } from 'three';
type SupportedMaterial = MeshStandardMaterial | MeshPhongMaterial;
export declare const useMaterials: () => {
    onNewMaterial: (callback: undefined | ((material: Material) => void)) => void;
    allMaterials: Set<SupportedMaterial>;
};
export {};
