export type EasingFunction = (elapsed: number, initialValue: number, amountOfChange: number, duration: number) => number;

export const easeInQuad: EasingFunction = (elapsed: number, initialValue: number, amountOfChange: number, duration: number) => {
    return amountOfChange * (elapsed /= duration) * elapsed + initialValue;
}

export const easeOutQuad: EasingFunction = (elapsed: number, initialValue: number, amountOfChange: number, duration: number) => {
	return -amountOfChange * (elapsed /= duration) * (elapsed - 2) + initialValue;
}