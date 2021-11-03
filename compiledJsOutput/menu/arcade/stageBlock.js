import ArcadeHandler from "./arcadeHandler.js";
export default class StageBlock {
    constructor(relativeX, relativeY, level, stageButton) {
        this.isSelected = false;
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
    select() {
    }
    deselect() {
    }
    update(delta) {
    }
    getBlockSize() {
        return ArcadeHandler.getHandler().FIELD_SECTION_SIZE * this.stageButton.scale;
    }
    getRealStartX() {
        return this.stageButton.x + this.x * this.getBlockSize();
    }
    getRealStartY() {
        return this.stageButton.y + this.y * this.getBlockSize();
    }
    getRealTextCenterX() {
        return this.getRealStartX() + this.getBlockSize() / 2;
    }
    getRealTextCenterY() {
        return this.getRealStartY() + this.getBlockSize() / 2;
    }
    getScaledFontSize() {
        return 40 * this.stageButton.scale;
    }
    draw(context) {
        const blockSize = this.getBlockSize();
        const startX = this.getRealStartX();
        const startY = this.getRealStartY();
        context.fillStyle = this.getColor().rgbString;
        context.strokeStyle = `rgba(0, 0, 0, ${this.getColor().alpha})`;
        context.lineWidth = 2 * this.stageButton.scale;
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(startX + blockSize, startY);
        context.lineTo(startX + blockSize, startY + blockSize);
        context.lineTo(startX, startY + blockSize);
        context.lineTo(startX, startY);
        context.fill();
        context.stroke();
        if (ArcadeHandler.getHandler().state == "levelSelect" && this.stageButton.isHoveredOrSelected()) {
            this.drawLevelNumber(context);
        }
    }
    drawLevelNumber(context) {
        context.font = `${this.getScaledFontSize()}px ft_default`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.lineWidth = 2;
        context.strokeStyle = `rgba(0, 0, 0, ${this.stageButton.getColor().alpha})`;
        context.fillStyle = `rgba(255, 255, 255, ${this.stageButton.getColor().alpha})`;
        const centerX = this.getRealTextCenterX();
        const centerY = this.getRealTextCenterY();
        context.fillText(this.level.levelNumber.toString(), centerX, centerY);
        context.strokeText(this.level.levelNumber.toString(), centerX, centerY);
    }
    getColor() {
        return this.stageButton.getColor();
    }
}
//# sourceMappingURL=stageBlock.js.map