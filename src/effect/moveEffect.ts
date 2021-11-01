import Positionable from "../util/positionable.js";
import Effect from "./effect.js";

export default class MoveEffect extends Effect {

    private readonly toMove: Positionable;
    private readonly startX: number;
    private readonly startY: number;
    private readonly endX: number;
    private readonly endY: number;

    public constructor(toMove: Positionable, x: number, y: number, time: number) {
        super(time);
        this.toMove = toMove;
        this.startX = toMove.x;
        this.startY = toMove.y;
        this.endX = x;
        this.endY = y;
    }

    public override onUpdate(delta: number) {
        this.toMove.x = this.startX + (this.endX - this.startX) * this.progress;
        this.toMove.y = this.startY + (this.endY - this.startY) * this.progress;
    }

    public override onEnd() {
        this.toMove.x = this.endX;
        this.toMove.y = this.endY;
    }

}