export default interface Colorizable {
	getColor(): Color;
}

export enum Color {
	RED = "rgb(255, 86, 86)",
	GREEN = "rgb(132, 255, 92)",
	BLUE = "rgb(73, 63, 251)",
	PINK = "rgb(254, 102, 255)",
	YELLOW = "rgb(255, 251, 97)",
	ORANGE = "rgb(255, 151, 70)"
}

export function getRandomColor(): Color {
    let colors: Color[] = [];
    for(const color in Color) {
        colors.push(Color[color]);
    }
    return colors[Math.floor(Math.random() * colors.length)];
}