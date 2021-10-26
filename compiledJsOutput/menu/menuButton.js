import Tetris from "../game/tetris.js";
export default class MenuButton {
    constructor() {
        this.blockSize = 100;
        this.shape = this.getShape();
        this.shapeWidth = this.getShapeWidth();
        this.shapeHeight = this.getShapeHeight();
        this.figureStartX = Tetris.instance.WINDOW_WIDTH / 2 - this.blockSize * this.shapeWidth / 2;
        this.figureStartY = Tetris.instance.WINDOW_HEIGHT / 2 - this.blockSize * this.shapeHeight / 2;
        this.textCenterX = this.figureStartX + this.getTextCenterPosition().x * this.blockSize;
        this.textCenterY = this.figureStartY + this.getTextCenterPosition().y * this.blockSize;
    }
    getShapeWidth() {
        let maxX = 0;
        for (const blockPos of this.shape) {
            if (blockPos.x > maxX)
                maxX = blockPos.x;
        }
        return maxX + 1;
    }
    getShapeHeight() {
        let maxY = 0;
        for (const blockPos of this.shape) {
            if (blockPos.y > maxY)
                maxY = blockPos.y;
        }
        return maxY + 1;
    }
    click() {
        this.onClick();
    }
    update(delta) {
    }
    draw(context) {
        this.drawFigure(context);
        this.drawText(context);
    }
    drawText(context) {
        context.fillStyle = "white";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "64px ft_default";
        context.fillText(this.getText(), this.textCenterX, this.textCenterY);
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.strokeText(this.getText(), this.textCenterX, this.textCenterY);
    }
    drawFigure(context) {
        context.strokeStyle = "black";
        context.lineWidth = 4;
        context.lineCap = "square";
        context.fillStyle = this.getColor();
        for (const blockPos of this.shape) {
            const currentStartX = this.figureStartX + blockPos.x * this.blockSize;
            const currentStartY = this.figureStartY + blockPos.y * this.blockSize;
            context.beginPath();
            context.moveTo(currentStartX, currentStartY);
            context.lineTo(currentStartX + this.blockSize, currentStartY);
            context.lineTo(currentStartX + this.blockSize, currentStartY + this.blockSize);
            context.lineTo(currentStartX, currentStartY + this.blockSize);
            context.lineTo(currentStartX, currentStartY);
            context.fill();
            context.beginPath();
            context.moveTo(currentStartX, currentStartY);
            if (this.isFree(blockPos, 0, -1)) {
                context.lineTo(currentStartX + this.blockSize, currentStartY);
            }
            else {
                context.moveTo(currentStartX + this.blockSize, currentStartY);
            }
            if (this.isFree(blockPos, 1, 0)) {
                context.lineTo(currentStartX + this.blockSize, currentStartY + this.blockSize);
            }
            else {
                context.moveTo(currentStartX + this.blockSize, currentStartY + this.blockSize);
            }
            if (this.isFree(blockPos, 0, 1)) {
                context.lineTo(currentStartX, currentStartY + this.blockSize);
            }
            else {
                context.moveTo(currentStartX, currentStartY + this.blockSize);
            }
            if (this.isFree(blockPos, -1, 0)) {
                context.lineTo(currentStartX, currentStartY);
            }
            context.stroke();
        }
    }
    isFree(blockPos, dx, dy) {
        return !this.shape.some(pos => pos.x == blockPos.x + dx && pos.y == blockPos.y + dy);
    }
}
//# sourceMappingURL=menuButton.js.map