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
        const sectionSize = ArcadeHandler.getHandler().FIELD_SECTION_SIZE;
        const startX = this.stageButton.x + this.x * sectionSize;
        const startY = this.stageButton.y + this.y * sectionSize;
        context.fillStyle = this.getColor().rgbString;
        context.strokeStyle = `rgb(0, 0, 0, ${this.getColor().alpha})`;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(startX + sectionSize, startY);
        context.lineTo(startX + sectionSize, startY + sectionSize);
        context.lineTo(startX, startY + sectionSize);
        context.lineTo(startX, startY);
        context.fill();
        context.stroke();
    }
    getColor() {
        return this.stageButton.getColor();
    }
}
//# sourceMappingURL=stageBlock.js.map