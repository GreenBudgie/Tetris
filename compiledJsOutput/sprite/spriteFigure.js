import Sprite from "./sprite.js";
import SpriteBlock from "./spriteBlock.js";
export default class SpriteFigure extends Sprite {
    constructor(shape) {
        super();
        this.blocks = [];
        this._blockSize = 32;
        this._outlineMode = "border";
        this._outlineWidth = 2;
        shape.forEach(point => {
            this.blocks.push(new SpriteBlock());
        });
        this._shape = shape;
        this.blockWidth = this.calculateBlockWidth();
        this.blockHeight = this.calculateBlockHeight();
    }
    calculateBlockWidth() {
        let maxX = 0;
        for (const blockPos of this.shape) {
            if (blockPos.x > maxX)
                maxX = blockPos.x;
        }
        return maxX + 1;
    }
    calculateBlockHeight() {
        let maxY = 0;
        for (const blockPos of this.shape) {
            if (blockPos.y > maxY)
                maxY = blockPos.y;
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
    drawSprite(context) {
        this.blocks.forEach((block, index) => {
            const blockPos = this.shape[index];
            block.getColor().setTo(this.getColor());
            block.size = this.blockSize;
            block.outline = this.outlineMode != "none";
            block.outlineWidth = this.outlineWidth;
            block.rotation = this.rotation;
            block.rotationCenter.setPosition(this.rotationCenter.x - this._shape[index].x, this.rotationCenter.y - this._shape[index].y);
            block.position.setPosition(this.position.x + this._shape[index].x * this.blockSize, this.position.y + this._shape[index].y * this.blockSize);
            if (this.outlineMode == "border") {
                block.outlineEdges = [false, false, false, false];
                if (this.isFree(blockPos, 0, -1)) {
                    block.outlineEdges[0] = true;
                }
                if (this.isFree(blockPos, 1, 0)) {
                    block.outlineEdges[1] = true;
                }
                if (this.isFree(blockPos, 0, 1)) {
                    block.outlineEdges[2] = true;
                }
                if (this.isFree(blockPos, -1, 0)) {
                    block.outlineEdges[3] = true;
                }
            }
            else {
                block.outlineEdges = [true, true, true, true];
            }
            block.draw(context);
        });
    }
    isFree(blockPos, dx, dy) {
        return !this.shape.some(pos => pos.x == blockPos.x + dx && pos.y == blockPos.y + dy);
    }
}
//# sourceMappingURL=spriteFigure.js.map