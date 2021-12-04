import BlockColor from "../color/blockColor.js";
import RGBColor from "../color/rgbColor.js";
import ArcadeHandler from "./arcade/arcadeHandler.js";
import MenuButton from "./menuButton.js";

export default class ButtonArcade extends MenuButton {

    public getTextCenterPosition(): {x: number; y: number;} {
        return {x: 1.5, y: 0.5};
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

    public getShape(): [number, number][] {
        return [
            [0, 1],
            [0, 0],
            [1, 0],
            [2, 0],
        ]
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