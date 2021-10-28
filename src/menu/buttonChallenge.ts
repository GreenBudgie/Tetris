import {Color} from "../game/color.js";
import StateHandler from "../state/stateHandler.js";
import MenuButton, {ButtonShape} from "./menuButton.js";

export default class ButtonChallenge extends MenuButton {

    public getTextCenterPosition(): {x: number; y: number;} {
        return {x: 1.5, y: 0.5};
    }

    public override getColor(): Color {
        return Color.ORANGE;
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