import { untrack } from 'svelte';
import { fromStore } from 'svelte/store';
const signal = Symbol();
const isStore = (dep) => {
    return typeof dep?.subscribe === 'function';
};
const runObserve = (dependencies, callback, pre) => {
    const stores = dependencies().map((d) => {
        if (isStore(d)) {
            return fromStore(d);
        }
        return signal;
    });
    const deps = $derived(dependencies().map((d, i) => {
        if (stores[i] === signal)
            return d;
        return stores[i].current;
    }));
    const effect = () => {
        deps;
        let cleanup = undefined;
        untrack(() => {
            cleanup = callback(deps);
        });
        return cleanup;
    };
    if (pre) {
        $effect.pre(effect);
    }
    else {
        $effect(effect);
    }
};
/**
 * ### `observe`
 *
 * Observe multiple stores and reactive values and call a callback when they
 * change to trigger side effects. The callback can return a cleanup function
 * that will be called when the dependencies change again or when the effect
 * root (most likely a component) is destroyed. Under the hood, `observe` uses
 * Svelte's `$effect` to track dependencies and trigger the callback. For a
 * version that uses `$effect.pre`, use `observe.pre`.
 *
 * ```ts
 * const count = writable(0)
 * let name = $state('John')
 *
 * observe(() => [count, name], ([count, name]) => {
 *  console.log(count, name) // 0 John
 * })
 * ```
 *
 * The callback can return a cleanup function that will be called when the
 * dependencies change again or when the component is destroyed.
 *
 * ```ts
 * const count = writable(0)
 *
 * observe(() => [count], ([count]) => {
 *  console.log(count) // 0
 *  return () => {
 *    console.log('cleanup')
 *  }
 * })
 * ```
 *
 * @param dependencies - A function that returns an array of dependencies.
 * @param callback - A function that will be called with the current values of
 * the dependencies. The callback can return a cleanup function that will be
 * called when the dependencies change again or when the component is destroyed.
 */
const observePost = (dependencies, callback) => {
    return runObserve(dependencies, callback, false);
};
/**
 * ### `observe.pre`
 *
 * Observe multiple stores and reactive values and call a callback when they
 * change to trigger side effects. The callback can return a cleanup function
 * that will be called when the dependencies change again or when the effect
 * root (most likely a component) is destroyed. Under the hood, `observe.pre` uses
 * Svelte's `$effect` to track dependencies and trigger the callback. For a
 * version that uses `$effect`, use `observe`.
 *
 * ```ts
 * const count = writable(0)
 * let name = $state('John')
 *
 * observe.pre(() => [count, name], ([count, name]) => {
 *  console.log(count, name) // 0 John
 * })
 * ```
 *
 * The callback can return a cleanup function that will be called when the
 * dependencies change again or when the component is destroyed.
 *
 * ```ts
 * const count = writable(0)
 *
 * observe.pre(() => [count], ([count]) => {
 *  console.log(count) // 0
 *  return () => {
 *    console.log('cleanup')
 *  }
 * })
 * ```
 *
 * @param dependencies - A function that returns an array of dependencies.
 * @param callback - A function that will be called with the current values of
 * the dependencies. The callback can return a cleanup function that will be
 * called when the dependencies change again or when the component is destroyed.
 */
const observePre = (dependencies, callback) => {
    return runObserve(dependencies, callback, true);
};
export const observe = Object.assign(observePost, { pre: observePre });
