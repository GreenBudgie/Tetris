import { Color } from "../game/color.js";
import StateHandler from "../state/stateHandler.js";
import MenuButton from "./menuButton.js";
export default class ButtonEndless extends MenuButton {
    getTextCenterPosition() {
        return { x: 1, y: 1.5 };
    }
    getColor() {
        return Color.BLUE;
    }
    getShapeWidth() {
        return 3;
    }
    onClick() {
        StateHandler.getHandler().GAME.begin();
    }
    getText() {
        return "Endless";
    }
    getShape() {
        return [
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 0, y: 1 },
            { x: 0, y: 2 },
        ];
    }
}
//# sourceMappingURL=buttonEndless%20copy.js.map