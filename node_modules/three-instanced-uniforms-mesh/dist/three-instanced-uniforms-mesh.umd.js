(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three'), require('troika-three-utils')) :
  typeof define === 'function' && define.amd ? define(['exports', 'three', 'troika-three-utils'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.three_instanced_uniforms_mesh = {}, global.THREE, global.troika_three_utils));
}(this, (function (exports, three, troikaThreeUtils) { 'use strict';

  function createInstancedUniformsDerivedMaterial (baseMaterial) {
    let _uniformNames = [];
    let _uniformNamesKey = '';

    const derived = troikaThreeUtils.createDerivedMaterial(baseMaterial, {
      chained: true,

      customRewriter ({ vertexShader, fragmentShader }) {
        let vertexDeclarations = [];
        let vertexAssignments = [];
        let fragmentDeclarations = [];

        // Find what uniforms are declared in which shader and their types
        let vertexUniforms = troikaThreeUtils.getShaderUniformTypes(vertexShader);
        let fragmentUniforms = troikaThreeUtils.getShaderUniformTypes(fragmentShader);

        // Add attributes and varyings for, and rewrite references to, the instanced uniforms
        _uniformNames.forEach((name) => {
          let vertType = vertexUniforms[name];
          let fragType = fragmentUniforms[name];
          const type = vertType || fragType;
          if (type) {
            const declarationFinder = new RegExp(`\\buniform\\s+${type}\\s+${name}\\s*;`, 'g');
            const referenceFinder = new RegExp(`\\b${name}\\b`, 'g');
            const attrName = `troika_attr_${name}`;
            const varyingName = `troika_vary_${name}`;
            vertexDeclarations.push(`attribute ${type} ${attrName};`);
            if (vertType) {
              vertexShader = vertexShader.replace(declarationFinder, '');
              vertexShader = vertexShader.replace(referenceFinder, attrName);
            }
            if (fragType) {
              fragmentShader = fragmentShader.replace(declarationFinder, '');
              fragmentShader = fragmentShader.replace(referenceFinder, varyingName);
              let varyingDecl = `varying ${fragType} ${varyingName};`;
              vertexDeclarations.push(varyingDecl);
              fragmentDeclarations.push(varyingDecl);
              vertexAssignments.push(`${varyingName} = ${attrName};`);
            }
          }
        });

        // Inject vertex shader declarations and assignments
        vertexShader = `${vertexDeclarations.join('\n')}\n${vertexShader.replace(troikaThreeUtils.voidMainRegExp, `\n$&\n${vertexAssignments.join('\n')}`)}`;

        // Inject fragment shader declarations
        if (fragmentDeclarations.length) {
          fragmentShader = `${fragmentDeclarations.join('\n')}\n${fragmentShader}`;
        }

        return { vertexShader, fragmentShader }
      }
    });

    /**
     * Update the set of uniform names that will be enabled for per-instance values. This
     * can be changed dynamically after instantiation.
     * @param {string[]} uniformNames
     */
    derived.setUniformNames = function(uniformNames) {
      _uniformNames = uniformNames || [];
      const key = _uniformNames.sort().join('|');
      if (key !== _uniformNamesKey) {
        _uniformNamesKey = key;
        this.needsUpdate = true;
      }
    };

    // Custom program cache key that allows for changing instanced uniforms
    const baseKey = derived.customProgramCacheKey();
    derived.customProgramCacheKey = function() {
      return baseKey + '|' + _uniformNamesKey
    };

    derived.isInstancedUniformsMaterial = true;
    return derived
  }

  class InstancedUniformsMesh extends three.InstancedMesh {
    constructor (geometry, material, count) {
      super(geometry, material, count);
      this._maxCount = count;
      this._instancedUniformNames = []; //treated as immutable
    }

    /*
     * Getter/setter for automatically wrapping the user-supplied geometry with one that will
     * carry our extra InstancedBufferAttribute(s). We do the wrapping lazily on _read_ rather
     * than write to avoid unnecessary wrapping on transient values.
     */
    get geometry () {
      let derivedGeom = this._derivedGeometry;
      const baseGeom = this._baseGeometry;
      if (!derivedGeom || derivedGeom.baseGeometry !== baseGeom) {
        derivedGeom = this._derivedGeometry = Object.create(baseGeom);
        derivedGeom.baseGeometry = baseGeom;
        derivedGeom.attributes = Object.create(baseGeom.attributes);
        // dispose the derived geometry when its base geometry is disposed:
        baseGeom.addEventListener('dispose', function onDispose () {
          baseGeom.removeEventListener('dispose', onDispose);
          derivedGeom.dispose();
        });
      }
      return derivedGeom
    }

    set geometry (geometry) {
      // Extend the geometry so we can add our instancing attributes but inherit everything else
      this._baseGeometry = geometry;
    }

    /*
     * Getter/setter for automatically wrapping the user-supplied material with our upgrades. We do the
     * wrapping lazily on _read_ rather than write to avoid unnecessary wrapping on transient values.
     */
    get material () {
      let derivedMaterial = this._derivedMaterial;
      const baseMaterial = this._baseMaterial || this._defaultMaterial || (this._defaultMaterial = new three.MeshBasicMaterial());
      if (!derivedMaterial || derivedMaterial.baseMaterial !== baseMaterial) {
        derivedMaterial = this._derivedMaterial = createInstancedUniformsDerivedMaterial(baseMaterial);
        // dispose the derived material when its base material is disposed:
        baseMaterial.addEventListener('dispose', function onDispose () {
          baseMaterial.removeEventListener('dispose', onDispose);
          derivedMaterial.dispose();
        });
      }
      derivedMaterial.setUniformNames(this._instancedUniformNames);
      return derivedMaterial
    }

    set material (baseMaterial) {
      if (Array.isArray(baseMaterial)) {
        throw new Error('InstancedUniformsMesh does not support multiple materials')
      }
      // Unwrap already-derived materials
      while (baseMaterial && baseMaterial.isInstancedUniformsMaterial) {
        baseMaterial = baseMaterial.baseMaterial;
      }
      this._baseMaterial = baseMaterial;
    }

    get customDepthMaterial () {
      return this.material.getDepthMaterial()
    }

    get customDistanceMaterial () {
      return this.material.getDistanceMaterial()
    }

    /**
     * Set the value of a shader uniform for a single instance.
     * @param {string} name - the name of the shader uniform
     * @param {number} index - the index of the instance to set the value for
     * @param {number|Vector2|Vector3|Vector4|Color|Array|Matrix3|Matrix4|Quaternion} value - the uniform value for this instance
     */
    setUniformAt (name, index, value) {
      const attrs = this.geometry.attributes;
      const attrName = `troika_attr_${name}`;
      let attr = attrs[attrName];
      if (!attr) {
        const defaultValue = getDefaultUniformValue(this._baseMaterial, name);
        const itemSize = getItemSizeForValue(defaultValue);
        attr = attrs[attrName] = new three.InstancedBufferAttribute(new Float32Array(itemSize * this._maxCount), itemSize);
        // Fill with default value:
        if (defaultValue !== null) {
          for (let i = 0; i < this._maxCount; i++) {
            setAttributeValue(attr, i, defaultValue);
          }
        }
        this._instancedUniformNames = [...this._instancedUniformNames, name];
      }
      setAttributeValue(attr, index, value);
      attr.needsUpdate = true;
    }

    /**
     * Unset all instance-specific values for a given uniform, reverting back to the original
     * uniform value for all.
     * @param {string} name
     */
    unsetUniform (name) {
      this.geometry.deleteAttribute(`troika_attr_${name}`);
      this._instancedUniformNames = this._instancedUniformNames.filter(n => n !== name);
    }
  }

  function setAttributeValue (attr, index, value) {
    let size = attr.itemSize;
    if (size === 1) {
      attr.setX(index, value);
    } else if (size === 2) {
      attr.setXY(index, value.x, value.y);
    } else if (size === 3) {
      if (value.isColor) {
        attr.setXYZ(index, value.r, value.g, value.b);
      } else {
        attr.setXYZ(index, value.x, value.y, value.z);
      }
    } else if (size === 4) {
      attr.setXYZW(index, value.x, value.y, value.z, value.w);
    } else if (value.toArray) {
      value.toArray(attr.array, index * size);
    } else {
      attr.set(value, index * size);
    }
  }

  function getDefaultUniformValue (material, name) {
    // Try uniforms on the material itself, then try the builtin material shaders
    let uniforms = material.uniforms;
    if (uniforms && uniforms[name]) {
      return uniforms[name].value
    }
    uniforms = troikaThreeUtils.getShadersForMaterial(material).uniforms;
    if (uniforms && uniforms[name]) {
      return uniforms[name].value
    }
    return null
  }

  function getItemSizeForValue (value) {
    return value == null ? 0
      : typeof value === 'number' ? 1
      : value.isVector2 ? 2
      : value.isVector3 || value.isColor ? 3
      : value.isVector4 || value.isQuaternion ? 4
      : value.elements ? value.elements.length
      : Array.isArray(value) ? value.length
      : 0
  }

  exports.InstancedUniformsMesh = InstancedUniformsMesh;
  exports.createInstancedUniformsDerivedMaterial = createInstancedUniformsDerivedMaterial;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
