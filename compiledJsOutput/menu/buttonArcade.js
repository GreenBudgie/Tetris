import BlockColor from "../color/blockColor.js";
import MenuButton from "./menuButton.js";
export default class ButtonArcade extends MenuButton {
    getTextCenterPosition() {
        return { x: 1.5, y: 1.5 };
    }
    getColor() {
        return BlockColor.RED;
    }
    onClick() {
    }
    getText() {
        return "Arcade";
    }
    getTextSize() {
        return 64;
    }
    getShape() {
        return [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 1, y: 0 },
        ];
    }
}
//# sourceMappingURL=buttonArcade.js.map