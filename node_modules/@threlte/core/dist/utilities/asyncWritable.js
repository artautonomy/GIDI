import { writable } from 'svelte/store';
/**
 * ### `asyncWritable`
 *
 * Creates a writable store that is initialized with a promise. The store also
 * implements the `then` and `catch` methods of the promise so that it can be
 * used in `await` expressions and `{#await}` blocks of Svelte.
 *
 * ```svelte
 * <script>
 *  import { asyncWritable } from '@threlte/core'
 *
 *  const asyncOp = async () => {
 *    // Do something async
 *  }
 *
 *  const store = asyncWritable(asyncOp())
 *  $: console.log($store) // asyncOp result
 * </script>
 *
 * <h1>
 *  {#await store then data}
 *    // Do something with the data
 *  {/await}
 * </h1>
 * ```
 *
 * If an error occurs in the promise, the error will be logged to the console
 * and the error can be accessed via the `error` property of the store with in
 * turn is a store.
 *
 * ```svelte
 * <script>
 *  import { asyncWritable } from '@threlte/core'
 *
 *  const asyncOp = async () => {
 *    throw new Error('Something went wrong')
 *  }
 *
 *  const store = asyncWritable(asyncOp())
 *  const error = store.error
 *
 *  $: console.log($store) // undefined
 *  $: console.log($error) // Error: Something went wrong
 * </script>
 * ```
 */
export const asyncWritable = (promise) => {
    const store = writable(undefined);
    const error = writable(undefined);
    promise
        .then((result) => {
        store.set(result);
    })
        .catch((e) => {
        console.error('Error in asyncWritable:', e.message);
        error.set(e);
    });
    return Object.assign(Object.assign(promise, store), { error, promise });
};
