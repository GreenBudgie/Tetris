export type EasingFunction = (elapsed: number, initialValue: number, amountOfChange: number, duration: number) => number;

export const noEasing: EasingFunction = (elapsed: number, initialValue: number, amountOfChange: number, duration: number) => {
    return elapsed;
}

export const easeInQuad: EasingFunction = (elapsed: number, initialValue: number, amountOfChange: number, duration: number) => {
    return amountOfChange * (elapsed /= duration) * elapsed + initialValue;
}

export const easeOutQuad: EasingFunction = (elapsed: number, initialValue: number, amountOfChange: number, duration: number) => {
	return -amountOfChange * (elapsed /= duration) * (elapsed - 2) + initialValue;
}

export const easeInOutQuad: EasingFunction = (elapsed: number, initialValue: number, amountOfChange: number, duration: number) => {
	if ((elapsed /= duration / 2) < 1) {
		return amountOfChange / 2 * elapsed * elapsed + initialValue;
	}
	return -amountOfChange / 2 * (--elapsed * (elapsed - 2) - 1) + initialValue;
}