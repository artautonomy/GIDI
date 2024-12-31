export const buildSceneGraph = (object) => {
    const data = { nodes: {}, materials: {} };
    if (object) {
        object.traverse((obj) => {
            if (obj.name)
                data.nodes[obj.name] = obj;
            if (obj.material && !data.materials[obj.material.name])
                data.materials[obj.material.name] = obj.material;
        });
    }
    return data;
};
