import { Color } from "../game/color.js";
import MenuButton from "./menuButton.js";
export default class ButtonChallenge extends MenuButton {
    getTextCenterPosition() {
        return { x: 1.5, y: 0.5 };
    }
    getColor() {
        return Color.ORANGE;
    }
    onClick() {
    }
    getTextSize() {
        return 58;
    }
    getText() {
        return "Challenge";
    }
    getShape() {
        return [
            { x: 0, y: 1 },
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
        ];
    }
}
//# sourceMappingURL=buttonChallenge.js.map