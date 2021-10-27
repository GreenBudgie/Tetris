import Tetris from "../game/tetris.js";
import Menu from "./menu.js";
export default class MenuButton {
    constructor(index) {
        this.blockSize = 100;
        this.shape = this.getShape();
        this.shapeWidth = this.getShapeWidth();
        this.shapeHeight = this.getShapeHeight();
        this.index = index;
        this.calculateYShift(Menu.getMenu().currentButtonIndex, Menu.getMenu().currentButtonIndex);
    }
    calculateYShift(previousIndex, currentIndex) {
        this.previousShiftY = this.getFigureShiftY(previousIndex);
        this.currentShiftY = this.getFigureShiftY(currentIndex);
    }
    getFigureShiftY(forIndex) {
        const currentIndex = forIndex;
        const indexShift = currentIndex - this.index;
        return indexShift * this.blockSize * 1.5;
    }
    getFigureStartX() {
        return Tetris.instance.WINDOW_WIDTH / 2 - this.blockSize * this.shapeWidth / 2;
    }
    getFigureStartY() {
        const startY = Tetris.instance.WINDOW_HEIGHT / 2 - this.blockSize * this.shapeHeight / 2;
        let effectProgress = 1;
        const effect = Menu.getMenu().buttonMoveEffect;
        if (effect?.isActive) {
            effectProgress = effect.progress;
        }
        const shiftedY = startY + (this.currentShiftY - this.previousShiftY) * effectProgress + this.previousShiftY;
        return shiftedY;
    }
    getTextCenterX() {
        return this.getFigureStartX() + this.getTextCenterPosition().x * this.blockSize;
    }
    getTextCenterY() {
        return this.getFigureStartY() + this.getTextCenterPosition().y * this.blockSize;
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
    isCurrent() {
        return Menu.getMenu().currentButton == this;
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
        context.fillText(this.getText(), this.getTextCenterX(), this.getTextCenterY());
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.strokeText(this.getText(), this.getTextCenterX(), this.getTextCenterY());
    }
    drawFigure(context) {
        context.strokeStyle = "black";
        context.lineWidth = 4;
        context.lineCap = "square";
        context.fillStyle = this.getColor();
        for (const blockPos of this.shape) {
            const currentStartX = this.getFigureStartX() + blockPos.x * this.blockSize;
            const currentStartY = this.getFigureStartY() + blockPos.y * this.blockSize;
            context.beginPath();
            context.moveTo(currentStartX - 1, currentStartY - 1);
            context.lineTo(currentStartX + this.blockSize + 1, currentStartY - 1);
            context.lineTo(currentStartX + this.blockSize + 1, currentStartY + this.blockSize + 1);
            context.lineTo(currentStartX - 1, currentStartY + this.blockSize + 1);
            context.lineTo(currentStartX - 1, currentStartY - 1);
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