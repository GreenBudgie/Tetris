import BlockColor from "../color/blockColor.js";
import RGBColor from "../color/rgbColor.js";
import MenuButton from "./menuButton.js";

export default class ButtonChallenge extends MenuButton {

    public getTextCenterPosition(): {x: number; y: number;} {
        return {x: 1.5, y: 1.5};
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

    public getShape(): [number, number][] {
        return [
            [0, 1],
            [1, 1],
            [2, 1],
            [1, 0]
        ]
    }

}