import RGBColor from "./rgbColor.js";
export default class BlockColor {
    static getRandomColor() {
        return BlockColor.COLORS[Math.floor(Math.random() * BlockColor.COLORS.length)];
    }
    static register(color) {
        BlockColor.COLORS.push(color);
        return color;
    }
}
BlockColor.COLORS = [];
BlockColor.RED = BlockColor.register(new RGBColor(255, 86, 86));
BlockColor.GREEN = BlockColor.register(new RGBColor(132, 255, 92));
BlockColor.BLUE = BlockColor.register(new RGBColor(73, 63, 251));
BlockColor.PINK = BlockColor.register(new RGBColor(254, 102, 255));
BlockColor.YELLOW = BlockColor.register(new RGBColor(255, 251, 97));
BlockColor.ORANGE = BlockColor.register(new RGBColor(255, 151, 70));
//# sourceMappingURL=blockColor.js.map