const classRegex = /^\s*class\s+/;
// Type Guards
const isClass = (input) => {
    if (typeof input !== 'function') {
        return false;
    }
    return classRegex.test(input.toString());
};
const argsIsConstructorParameters = (args) => {
    return Array.isArray(args);
};
export const determineRef = (is, args) => {
    if (isClass(is)) {
        if (argsIsConstructorParameters(args)) {
            return new is(...args);
        }
        else {
            return new is();
        }
    }
    return is;
};
