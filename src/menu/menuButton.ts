import Colorizable, {Color} from "../game/color.js";
import Processable from "../util/processable.js";

export default abstract class MenuButton implements Colorizable, Processable {

    public abstract getColor(): Color;
    public abstract onClick(): void;
    public abstract getText(): void;
    public abstract getIndex(): number;
    public abstract drawShape(): void;

    public click(): void {
        this.onClick();
    }

    update(delta: number): void {
        throw new Error("Method not implemented.");
    }

    draw(context: CanvasRenderingContext2D): void {
        throw new Error("Method not implemented.");
    }

}