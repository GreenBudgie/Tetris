import BlockColor from "../color/blockColor.js";
import RGBColor from "../color/rgbColor.js";
import Point, {PointArray} from "../util/point.js";
import ArcadeHandler from "./arcade/arcadeHandler.js";
import MenuButton from "./menuButton.js";

export default class ButtonArcade extends MenuButton {

    public getTextCenterPosition(): Point {
        return new Point(1.5, 0.5);
    }

    public override getColor(): RGBColor {
        return BlockColor.ORANGE;
    }

    public onClick(): void {
        ArcadeHandler.getHandler().startStageSelect();
    }

    public getTextSize(): number {
        return 64;
    }

    public getText(): string {
        return "Arcade";
    }

    public getShape(): Point[] {
        return PointArray.begin(0, 1).add(0, 0).add(1, 0).add(2, 0).build();
    }

    public override onSelect() {
        ArcadeHandler.getHandler().state = "show";
        ArcadeHandler.getHandler().playAppearEffect();
    }

    public override onDeselect() {
        ArcadeHandler.getHandler().playDisappearEffect();
    }

    public override update(delta: number) {
        super.update(delta);
        ArcadeHandler.getHandler().update(delta);
    }

    public override draw(context: CanvasRenderingContext2D) {
        super.draw(context);
        ArcadeHandler.getHandler().draw(context);
    }

}