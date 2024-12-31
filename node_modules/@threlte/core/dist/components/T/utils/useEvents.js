/**
 * Typeguard to check if a value is extending THREE.EventDispatcher
 * @param value
 * @returns
 */
const isEventDispatcher = (value) => {
    return (value !== null &&
        typeof value === 'object' &&
        'addEventListener' in value &&
        'removeEventListener' in value);
};
export const useEvents = (props = {}) => {
    const eventHandlerProxy = (event) => {
        if (event?.type) {
            props[`on${event.type}`]?.(event);
        }
    };
    const addEventListeners = (ref, props) => {
        const eventNames = [];
        for (const eventName of Object.keys(props)) {
            if (eventName.startsWith('on')) {
                ref.addEventListener(eventName.slice(2), eventHandlerProxy);
                eventNames.push(eventName);
            }
        }
        return () => {
            for (let i = 0; i < eventNames.length; i++) {
                ref.removeEventListener(eventNames[i], eventHandlerProxy);
            }
        };
    };
    const updateRef = (ref) => {
        if (!isEventDispatcher(ref))
            return;
        return addEventListeners(ref, props);
    };
    return {
        updateRef
    };
};
