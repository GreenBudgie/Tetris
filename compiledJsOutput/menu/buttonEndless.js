import BlockColor from "../color/blockColor.js";
import MenuButton from "./menuButton.js";
export default class ButtonEndless extends MenuButton {
    getTextCenterPosition() {
        return { x: 1, y: 1.5 };
    }
    getColor() {
        return BlockColor.BLUE;
    }
    getShapeWidth() {
        return 3;
    }
    getTextSize() {
        return 48;
    }
    onClick() {
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
//# sourceMappingURL=buttonEndless.js.map