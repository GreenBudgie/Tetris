import BlockColor from "../color/blockColor.js";
import MenuButton from "./menuButton.js";
export default class ButtonChallenge extends MenuButton {
    getTextCenterPosition() {
        return { x: 1.5, y: 1.5 };
    }
    getColor() {
        return BlockColor.RED;
    }
    onClick() {
    }
    getText() {
        return "Challenge";
    }
    getTextSize() {
        return 58;
    }
    getShape() {
        return [
            [0, 1],
            [1, 1],
            [2, 1],
            [1, 0]
        ];
    }
}
//# sourceMappingURL=buttonChallenge.js.map