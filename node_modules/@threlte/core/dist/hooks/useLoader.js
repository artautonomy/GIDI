import { useCache } from '../context/fragments/cache';
import { asyncWritable } from '../utilities';
export function useLoader(Proto, options) {
    const { remember, clear: clearCacheItem } = useCache();
    let loader;
    const initializeLoader = () => {
        // Type-wrestling galore
        const lazyLoader = new Proto(...(options?.args ?? []));
        // extend the loader if necessary
        options?.extend?.(lazyLoader);
        return lazyLoader;
    };
    const load = (input, options) => {
        // Allow Async and Sync loaders
        const loadResource = async (url) => {
            if (!loader) {
                loader = initializeLoader();
            }
            if ('loadAsync' in loader) {
                const result = await loader.loadAsync(url, options?.onProgress);
                return options?.transform?.(result) ?? result;
            }
            else {
                return new Promise((resolve, reject) => {
                    ;
                    loader.load(url, (data) => resolve(options?.transform?.(data) ?? data), (event) => options?.onProgress?.(event), reject);
                });
            }
        };
        if (Array.isArray(input)) {
            // map over the input array and return an array of promises
            const promises = input.map((url) => {
                return remember(() => loadResource(url), [Proto, url]);
            });
            // return an AsyncWritable that resolves to the array of promises
            const store = asyncWritable(Promise.all(promises));
            return store; // TODO: Dirty escape hatch
        }
        else if (typeof input === 'string') {
            const promise = remember(() => loadResource(input), [Proto, input]);
            // return an AsyncWritable that resolves to the promise
            const store = asyncWritable(promise);
            return store; // TODO: Dirty escape hatch
        }
        else {
            // map over the input object and return an array of promises
            const promises = Object.values(input).map((url) => {
                return remember(() => loadResource(url), [Proto, url]);
            });
            // return an AsyncWritable that resolves to the object of promises
            const store = asyncWritable(Promise.all(promises).then((results) => {
                return Object.fromEntries(Object.entries(input).map(([key], i) => [key, results[i]]));
            }));
            return store; // TODO: Dirty escape hatch
        }
    };
    const clear = (input) => {
        if (Array.isArray(input)) {
            input.forEach((url) => {
                clearCacheItem([Proto, url]);
            });
        }
        else if (typeof input === 'string') {
            clearCacheItem([Proto, input]);
        }
        else {
            Object.entries(input).forEach(([key, url]) => {
                clearCacheItem([Proto, key, url]);
            });
        }
    };
    return {
        load,
        clear,
        loader
    };
}
// Type tests
// class WithConstructorParameters {
//   constructor(hello: 'abc' | 'def') {
//     console.log(hello)
//   }
//   loadAsync(url: string, onProgress?: (event: ProgressEvent) => void): Promise<any> {
//     return new Promise((r) => r('hello'))
//   }
// }
// class WithOptionalConstructorParameters {
//   constructor(hello?: string) {
//     console.log(hello)
//   }
//   loadAsync(url: string, onProgress?: (event: ProgressEvent) => void): Promise<any> {
//     return new Promise((r) => r('hello'))
//   }
// }
// class WithoutConstructorParameters {
//   constructor() {
//     console.log('without')
//   }
//   loadAsync(url: string, onProgress?: (event: ProgressEvent) => void): Promise<any> {
//     return new Promise((r) => r('hello'))
//   }
// }
// const shouldFail = () => {
//   useLoader(WithConstructorParameters)
//   useLoader(WithoutConstructorParameters, {
//     args: ['hello']
//   })
// }
// const shouldSucceed = () => {
//   useLoader(WithConstructorParameters, {
//     args: ['abc']
//   })
//   useLoader(WithConstructorParameters, {
//     args: ['abc'],
//     extend(loader) {
//       // …
//     }
//   })
//   useLoader(WithOptionalConstructorParameters)
//   useLoader(WithOptionalConstructorParameters, {
//     extend(loader) {
//       // …
//     }
//   })
//   useLoader(WithOptionalConstructorParameters, {
//     args: [],
//     extend(loader) {
//       // …
//     }
//   })
//   useLoader(WithOptionalConstructorParameters, {
//     args: ['hello'],
//     extend(loader) {
//       // …
//     }
//   })
//   useLoader(WithOptionalConstructorParameters, {
//     args: ['hello']
//   })
//   useLoader(WithoutConstructorParameters)
//   useLoader(WithoutConstructorParameters, {
//     extend(loader) {
//       // …
//     }
//   })
// }
