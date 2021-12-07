import Effect from "./effect.js";
export default class MoveEffect extends Effect {
    constructor(toMove, target, time) {
        super(time);
        this.toMove = toMove;
        this.startPos = toMove.position.clone();
        this.targetPos = target.clone();
    }
    onUpdate(delta) {
        this.toMove.position.x = this.startPos.x + (this.targetPos.x - this.startPos.x) * this.progress;
        this.toMove.position.y = this.startPos.y + (this.targetPos.y - this.startPos.y) * this.progress;
    }
    onEnd() {
        this.toMove.position.setPositionTo(this.targetPos);
    }
}
//# sourceMappingURL=moveEffect.js.map