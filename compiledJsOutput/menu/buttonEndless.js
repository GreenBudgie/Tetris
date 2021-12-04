import BlockColor from "../color/blockColor.js";
import MenuButton from "./menuButton.js";
export default class ButtonEndless extends MenuButton {
    getTextCenterPosition() {
        return { x: 1, y: 1.5 };
    }
    getColor() {
        return BlockColor.BLUE;
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
            [1, 0],
            [1, 1],
            [0, 1],
            [0, 2],
        ];
    }
}
//# sourceMappingURL=buttonEndless.js.map