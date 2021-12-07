import BlockColor from "../color/blockColor.js";
import RGBColor from "../color/rgbColor.js";
import Point, {PointArray} from "../util/point.js";
import MenuButton from "./menuButton.js";

export default class ButtonChallenge extends MenuButton {

    public getTextCenterPosition(): Point {
        return new Point(1.5, 1.5);
    }

    public override getColor(): RGBColor {
        return BlockColor.RED;
    }

    public onClick(): void {
        
    }

    public getText(): string {
        return "Challenge";
    }

    public getTextSize(): number {
        return 58;
    }

    public getShape(): Point[] {
        return PointArray.begin(0, 1).add(1, 1).add(2, 1).add(1, 0).build();
    }

}