import Effect from "./effect.js";
export default class MoveEffect extends Effect {
    constructor(toMove, x, y, time) {
        super(time);
        this.toMove = toMove;
        this.startX = toMove.x;
        this.startY = toMove.y;
        this.endX = x;
        this.endY = y;
    }
    onUpdate(delta) {
        this.toMove.x = this.startX + (this.endX - this.startX) * this.progress;
        this.toMove.y = this.startY + (this.endY - this.startY) * this.progress;
    }
}
//# sourceMappingURL=moveEffect.js.map