import {Color} from "../game/color.js";
import MenuButton, {ButtonShape} from "./menuButton.js";

export default class ButtonEndless extends MenuButton {

    public getTextCenterPosition(): {x: number; y: number;} {
        return {x: 1, y: 1.5};
    }

    public override getColor(): Color {
        return Color.BLUE;
    }

    public onClick(): void {
        
    }

    public getText(): string {
        return "Endless";
    }

    public getShape(): ButtonShape {
        return [
            {x: 1, y: 0},
            {x: 1, y: 1},
            {x: 0, y: 1},
            {x: 0, y: 2},
        ]
    }

}