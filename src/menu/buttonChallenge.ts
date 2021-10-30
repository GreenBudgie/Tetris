import BlockColor from "../color/blockColor.js";
import RGBColor from "../color/rgbColor.js";
import MenuButton, {ButtonShape} from "./menuButton.js";

export default class ButtonChallenge extends MenuButton {

    public getTextCenterPosition(): {x: number; y: number;} {
        return {x: 1.5, y: 0.5};
    }

    public override getColor(): RGBColor {
        return BlockColor.ORANGE;
    }

    public onClick(): void {

    }

    public getTextSize(): number {
        return 58;
    }

    public getText(): string {
        return "Challenge";
    }

    public getShape(): ButtonShape {
        return [
            {x: 0, y: 1},
            {x: 0, y: 0},
            {x: 1, y: 0},
            {x: 2, y: 0},
        ]
    }

}