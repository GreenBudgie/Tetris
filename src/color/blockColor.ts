import RGBColor from "./rgbColor.js";

export default class BlockColor {

    public static readonly COLORS: RGBColor[] = [];

    public static readonly RED = BlockColor.register(new RGBColor(255, 86, 86));
    public static readonly GREEN = BlockColor.register(new RGBColor(132, 255, 92));
    public static readonly BLUE = BlockColor.register(new RGBColor(73, 63, 251));
    public static readonly PINK = BlockColor.register(new RGBColor(254, 102, 255));
    public static readonly YELLOW = BlockColor.register(new RGBColor(255, 251, 97));
    public static readonly ORANGE = BlockColor.register(new RGBColor(255, 151, 70));

    public static getRandomColor(): RGBColor {
        return BlockColor.COLORS[Math.floor(Math.random() * BlockColor.COLORS.length)];
    }

    private static register(color: RGBColor): RGBColor {
        BlockColor.COLORS.push(color);
        return color;
    }

}
