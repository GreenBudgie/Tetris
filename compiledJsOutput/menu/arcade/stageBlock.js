import ArcadeHandler from "./arcadeHandler.js";
export default class StageBlock {
    constructor(relativeX, relativeY, level, stageButton) {
        this.x = relativeX;
        this.y = relativeY;
        this.level = level;
        this.stageButton = stageButton;
    }
    get x() {
        return this._x;
    }
    set x(x) {
        this._x = x;
    }
    get y() {
        return this._y;
    }
    set y(y) {
        this._y = y;
    }
    update(delta) {
    }
    draw(context) {
        const blockSize = ArcadeHandler.getHandler().FIELD_SECTION_SIZE * this.stageButton.scale;
        const startX = this.stageButton.x + this.x * blockSize;
        const startY = this.stageButton.y + this.y * blockSize;
        context.fillStyle = this.getColor().rgbString;
        context.strokeStyle = `rgb(0, 0, 0, ${this.getColor().alpha})`;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(startX + blockSize, startY);
        context.lineTo(startX + blockSize, startY + blockSize);
        context.lineTo(startX, startY + blockSize);
        context.lineTo(startX, startY);
        context.fill();
        context.stroke();
    }
    getColor() {
        return this.stageButton.getColor();
    }
}
//# sourceMappingURL=stageBlock.js.map