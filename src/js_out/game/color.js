export var Color;
(function (Color) {
    Color["RED"] = "rgb(255, 86, 86)";
    Color["GREEN"] = "rgb(132, 255, 92)";
    Color["BLUE"] = "rgb(73, 63, 251)";
    Color["PINK"] = "rgb(254, 102, 255)";
    Color["YELLOW"] = "rgb(255, 251, 97)";
    Color["ORANGE"] = "rgb(255, 151, 70)";
})(Color || (Color = {}));
export function getRandomColor() {
    let colors = [];
    for (const color in Color) {
        colors.push(Color[color]);
    }
    return colors[Math.floor(Math.random() * colors.length)];
}
//# sourceMappingURL=color.js.map