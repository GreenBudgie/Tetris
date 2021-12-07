import BlockColor from "../color/blockColor.js";
import Point, { PointArray } from "../util/point.js";
import MenuButton from "./menuButton.js";
export default class ButtonChallenge extends MenuButton {
    getTextCenterPosition() {
        return new Point(1.5, 1.5);
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
        return PointArray.begin(0, 1).add(1, 1).add(2, 1).add(1, 0).build();
    }
}
//# sourceMappingURL=buttonChallenge.js.map