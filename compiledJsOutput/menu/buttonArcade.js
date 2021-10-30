import BlockColor from "../color/blockColor.js";
import MenuButton from "./menuButton.js";
export default class ButtonArcade extends MenuButton {
    getTextCenterPosition() {
        return { x: 1.5, y: 0.5 };
    }
    getColor() {
        return BlockColor.ORANGE;
    }
    onClick() {
    }
    getTextSize() {
        return 64;
    }
    getText() {
        return "Arcade";
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
//# sourceMappingURL=buttonArcade.js.map