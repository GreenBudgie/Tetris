import BlockColor from "../color/blockColor.js";
import Point, { PointArray } from "../util/point.js";
import ArcadeHandler from "./arcade/arcadeHandler.js";
import MenuButton from "./menuButton.js";
export default class ButtonArcade extends MenuButton {
    getTextCenterPosition() {
        return new Point(1.5, 0.5);
    }
    getColor() {
        return BlockColor.ORANGE;
    }
    onClick() {
        ArcadeHandler.getHandler().startStageSelect();
    }
    getTextSize() {
        return 64;
    }
    getText() {
        return "Arcade";
    }
    getShape() {
        return PointArray.begin(0, 1).add(0, 0).add(1, 0).add(2, 0).build();
    }
    onSelect() {
        ArcadeHandler.getHandler().state = "show";
        ArcadeHandler.getHandler().playAppearEffect();
    }
    onDeselect() {
        ArcadeHandler.getHandler().playDisappearEffect();
    }
    update(delta) {
        super.update(delta);
        ArcadeHandler.getHandler().update(delta);
    }
    draw(context) {
        super.draw(context);
        ArcadeHandler.getHandler().draw(context);
    }
}
//# sourceMappingURL=buttonArcade.js.map