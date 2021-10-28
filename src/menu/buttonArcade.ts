import {Color} from "../game/color.js";
import MenuButton, {ButtonShape} from "./menuButton.js";

export default class ButtonArcade extends MenuButton {

    public getTextCenterPosition(): {x: number; y: number;} {
        return {x: 1.5, y: 1.5};
    }

    public override getColor(): Color {
        return Color.RED;
    }

    public onClick(): void {
        
    }

    public getText(): string {
        return "Arcade";
    }

    public getTextSize(): number {
        return 64;
    }

    public getShape(): ButtonShape {
        return [
            {x: 0, y: 1},
            {x: 1, y: 1},
            {x: 2, y: 1},
            {x: 1, y: 0},
        ]
    }

}