import Tetris from "../game/tetris.js";
export default class MenuButton {
    constructor() {
        this.blockSize = 100;
        this.shape = this.getShape();
        this.shapeWidth = this.getShapeWidth();
        this.shapeHeight = this.getShapeHeight();
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
        const centerX = Tetris.instance.WINDOW_WIDTH / 2;
        const centerY = Tetris.instance.WINDOW_HEIGHT / 2;
        const startX = centerX - this.blockSize * this.shapeWidth / 2;
        const startY = centerY - this.blockSize * this.shapeHeight / 2;
        context.strokeStyle = "black";
        context.lineWidth = 4;
        context.lineCap = "square";
        context.fillStyle = this.getColor();
        for (const blockPos of this.shape) {
            const currentStartX = startX + blockPos.x * this.blockSize;
            const currentStartY = startY + blockPos.y * this.blockSize;
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