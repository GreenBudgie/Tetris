import BlockColor from "../color/blockColor.js";
import Point, { PointArray } from "../util/point.js";
import MenuButton from "./menuButton.js";
export default class ButtonEndless extends MenuButton {
    getTextCenterPosition() {
        return new Point(1, 1.5);
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
        return PointArray.begin(1, 0).add(1, 1).add(0, 1).add(0, 2).build();
    }
}
//# sourceMappingURL=buttonEndless.js.map