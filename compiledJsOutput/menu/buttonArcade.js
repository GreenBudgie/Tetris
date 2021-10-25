import { Color } from "../game/color.js";
import MenuButton from "./menuButton.js";
export default class ButtonArcade extends MenuButton {
    getColor() {
        return Color.RED;
    }
    onClick() {
    }
    getText() {
        return "Arcade";
    }
    getIndex() {
        return 0;
    }
    getShape() {
        return [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 2, y: 1 },
        ];
    }
}
//# sourceMappingURL=buttonArcade.js.map