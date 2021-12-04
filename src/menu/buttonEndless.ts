import BlockColor from "../color/blockColor.js";
import RGBColor from "../color/rgbColor.js";
import StateHandler from "../state/stateHandler.js";
import MenuButton from "./menuButton.js";

export default class ButtonEndless extends MenuButton {

    public getTextCenterPosition(): {x: number; y: number;} {
        return {x: 1, y: 1.5};
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

    public getShape(): [number, number][] {
        return [
            [1, 0],
            [1, 1],
            [0, 1],
            [0, 2],
        ]
    }

}