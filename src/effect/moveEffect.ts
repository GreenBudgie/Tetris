import Point, {Positionable} from "../util/point.js";
import Effect from "./effect.js";

export default class MoveEffect extends Effect {

    private readonly toMove: Positionable;
    private readonly startPos: Point;
    private readonly targetPos: Point;

    public constructor(toMove: Positionable, target: Point, time: number) {
        super(time);
        this.toMove = toMove;
        this.startPos = toMove.position.clone();
        this.targetPos = target.clone();
    }

    public override onUpdate(delta: number) {
        this.toMove.position.x = this.startPos.x + (this.targetPos.x - this.startPos.x) * this.progress;
        this.toMove.position.y = this.startPos.y + (this.targetPos.y - this.startPos.y) * this.progress;
    }

    public override setTargetValues(): void {
        this.toMove.position.setPositionTo(this.targetPos);
    }

}