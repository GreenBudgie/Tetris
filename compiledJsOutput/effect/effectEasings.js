export const noEasing = (elapsed, initialValue, amountOfChange, duration) => {
    return elapsed;
};
export const easeInQuad = (elapsed, initialValue, amountOfChange, duration) => {
    return amountOfChange * (elapsed /= duration) * elapsed + initialValue;
};
export const easeOutQuad = (elapsed, initialValue, amountOfChange, duration) => {
    return -amountOfChange * (elapsed /= duration) * (elapsed - 2) + initialValue;
};
//# sourceMappingURL=effectEasings.js.map