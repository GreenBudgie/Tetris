import BlockColor from "../color/blockColor.js";
import RGBColor from "../color/rgbColor.js";
import ArcadeHandler from "./arcade/arcadeHandler.js";
import MenuButton, {ButtonShape} from "./menuButton.js";

export default class ButtonArcade extends MenuButton {

    public getTextCenterPosition(): {x: number; y: number;} {
        return {x: 1.5, y: 0.5};
    }

    public override getColor(): RGBColor {
        return BlockColor.ORANGE;
    }

    public onClick(): void {

    }

    public getTextSize(): number {
        return 64;
    }

    public getText(): string {
        return "Arcade";
    }

    public getShape(): ButtonShape {
        return [
            {x: 0, y: 1},
            {x: 0, y: 0},
            {x: 1, y: 0},
            {x: 2, y: 0},
        ]
    }

    public override onSelect() {
        ArcadeHandler.getHandler().needsToDraw = true;
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