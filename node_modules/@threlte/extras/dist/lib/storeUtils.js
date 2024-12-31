export const toCurrentReadable = (store) => {
    return {
        subscribe: store.subscribe,
        get current() {
            return store.current;
        }
    };
};
