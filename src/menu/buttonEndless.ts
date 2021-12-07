import BlockColor from "../color/blockColor.js";
import RGBColor from "../color/rgbColor.js";
import Point, {PointArray} from "../util/point.js";
import MenuButton from "./menuButton.js";

export default class ButtonEndless extends MenuButton {

    public getTextCenterPosition(): Point {
        return new Point(1, 1.5);
    }

    public override getColor(): RGBColor {
        return BlockColor.BLUE;
    }

    public getTextSize(): number {
        return 48;
    }

    public onClick(): void {
        
    }

    public getText(): string {
        return "Endless";
    }

    public getShape(): Point[] {
        return PointArray.begin(1, 0).add(1, 1).add(0, 1).add(0, 2).build();
    }

}