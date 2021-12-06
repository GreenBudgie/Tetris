import Sprite from "./sprite.js";
export default class SpriteFigure extends Sprite {
    constructor(shape) {
        super();
        this._blockSize = 32;
        this._outlineMode = "border";
        this._outlineWidth = 2;
        this._shape = shape;
        this.blockWidth = this.calculateBlockWidth();
        this.blockHeight = this.calculateBlockHeight();
    }
    calculateBlockWidth() {
        let maxX = 0;
        for (const blockPos of this.shape) {
            if (blockPos[0] > maxX)
                maxX = blockPos[0];
        }
        return maxX + 1;
    }
    calculateBlockHeight() {
        let maxY = 0;
        for (const blockPos of this.shape) {
            if (blockPos[1] > maxY)
                maxY = blockPos[1];
        }
        return maxY + 1;
    }
    getBlockWidth() {
        return this.blockWidth;
    }
    getBlockHeight() {
        return this.blockHeight;
    }
    getRealWidth() {
        return this.blockWidth * this.blockSize;
    }
    getRealHeight() {
        return this.blockHeight * this.blockSize;
    }
    get shape() {
        return this._shape;
    }
    get blockSize() {
        return this._blockSize;
    }
    set blockSize(blockSize) {
        this._blockSize = blockSize;
    }
    get outlineMode() {
        return this._outlineMode;
    }
    set outlineMode(value) {
        this._outlineMode = value;
    }
    get outlineWidth() {
        return this._outlineWidth;
    }
    set outlineWidth(value) {
        this._outlineWidth = value;
    }
    setOutlineWidthBasedOnBlockSize() {
        this._outlineWidth = Math.round(this.blockSize / 20);
    }
    getBlockDrawStartPosition(blockPos) {
        const xNoRotation = this.x + blockPos[0] * this.blockSize;
        const yNoRotation = this.y + blockPos[1] * this.blockSize;
        if (this.rotation == 0) {
            return [xNoRotation, yNoRotation];
        }
        const originX = xNoRotation - this.getRealRotationCenter()[0];
        const originY = yNoRotation - this.getRealRotationCenter()[1];
        const rotatedX = originX * this.rotationSinCos[1] - originY * this.rotationSinCos[0];
        const rotatedY = originX * this.rotationSinCos[0] + originY * this.rotationSinCos[1];
        return [rotatedX + this.getRealRotationCenter()[0], rotatedY + this.getRealRotationCenter()[1]];
    }
    drawSprite(context) {
        context.fillStyle = this.getColor().rgbString;
        context.strokeStyle = "black";
        context.lineWidth = this._outlineWidth;
        context.lineCap = "square";
        const shift = this._outlineWidth % 2 == 0 ? 0 : 0.5;
        const outlineBlocks = this._outlineMode == "block";
        for (const blockPos of this.shape) {
            const startPos = this.getBlockDrawStartPosition(blockPos);
            let currentStartX = startPos[0];
            let currentStartY = startPos[1];
            context.beginPath();
            context.moveTo(currentStartX - 1, currentStartY - 1);
            context.lineTo(currentStartX + this.blockSize + 1, currentStartY - 1);
            context.lineTo(currentStartX + this.blockSize + 1, currentStartY + this.blockSize + 1);
            context.lineTo(currentStartX - 1, currentStartY + this.blockSize + 1);
            context.lineTo(currentStartX - 1, currentStartY - 1);
            context.fill();
            if (this._outlineMode == "none")
                continue;
            currentStartX -= shift;
            currentStartY -= shift;
            context.beginPath();
            context.moveTo(currentStartX, currentStartY);
            if (this.isFree(blockPos, 0, -1) || outlineBlocks) {
                context.lineTo(currentStartX + this.blockSize, currentStartY);
            }
            else {
                context.moveTo(currentStartX + this.blockSize, currentStartY);
            }
            if (this.isFree(blockPos, 1, 0) || outlineBlocks) {
                context.lineTo(currentStartX + this.blockSize, currentStartY + this.blockSize);
            }
            else {
                context.moveTo(currentStartX + this.blockSize, currentStartY + this.blockSize);
            }
            if (this.isFree(blockPos, 0, 1) || outlineBlocks) {
                context.lineTo(currentStartX, currentStartY + this.blockSize);
            }
            else {
                context.moveTo(currentStartX, currentStartY + this.blockSize);
            }
            if (this.isFree(blockPos, -1, 0) || outlineBlocks) {
                context.lineTo(currentStartX, currentStartY);
            }
            context.stroke();
        }
    }
    isFree(blockPos, dx, dy) {
        return !this.shape.some(pos => pos[0] == blockPos[0] + dx && pos[1] == blockPos[1] + dy);
    }
}
//# sourceMappingURL=spriteFigure.js.map