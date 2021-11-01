export const noEasing = (elapsed, initialValue, amountOfChange, duration) => {
    return elapsed;
};
export const easeInQuad = (elapsed, initialValue, amountOfChange, duration) => {
    return amountOfChange * (elapsed /= duration) * elapsed + initialValue;
};
export const easeOutQuad = (elapsed, initialValue, amountOfChange, duration) => {
    return -amountOfChange * (elapsed /= duration) * (elapsed - 2) + initialValue;
};
export const easeInOutQuad = (elapsed, initialValue, amountOfChange, duration) => {
    if ((elapsed /= duration / 2) < 1) {
        return amountOfChange / 2 * elapsed * elapsed + initialValue;
    }
    return -amountOfChange / 2 * (--elapsed * (elapsed - 2) - 1) + initialValue;
};
//# sourceMappingURL=effectEasings.js.map