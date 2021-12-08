import SpriteBlock from "../sprite/spriteBlock.js";
import GameProcess from "./gameProcess.js";
export class AbstractBlock {
    constructor(section) {
        this.section = section;
        this.sprite = new SpriteBlock();
        this.sprite.outline = true;
        this.sprite.outlineWidth = 1;
    }
    update(delta) { }
    draw(context) {
        this.sprite.draw(context);
    }
}
/**
 * Represents a block that takes place at the field
 */
export class FieldBlock extends AbstractBlock {
    constructor(section) {
        super(section);
        this.setSpritePosition();
    }
    moveDown() {
        this.section.y += 1;
        this.setSpritePosition();
    }
    setSpritePosition() {
        const process = GameProcess.getCurrentProcess();
        this.sprite.position.x = process.field.getRealFieldPosition().x + this.section.x * process.field.realSectionSize;
        this.sprite.position.y = process.field.getRealFieldPosition().y + this.section.y * process.field.realSectionSize;
    }
}
/**
 * Represents a block that is attached to a figure
 */
export class FigureBlock extends AbstractBlock {
    get figure() {
        return this._figure;
    }
    set figure(value) {
        this._figure = value;
        this.sprite.getColor().setTo(this._figure.getColor());
    }
    /**
     * Checks whether the block is able to move right
     * @returns ALLOW if the block is able to move right, BOUNDARY if a wall obstructs the movement, BLOCK if a block obstructs the movement
     */
    checkMoveRight() {
        return this.checkMove(1, 0);
    }
    /**
     * Checks whether the block is able to move left
     * @returns ALLOW if the block is able to move left, BOUNDARY if a wall obstructs the movement, BLOCK if a block obstructs the movement
     */
    checkMoveLeft() {
        return this.checkMove(-1, 0);
    }
    /**
     * Checks whether the block is able to move down
     * @returns ALLOW if the block is able to move down, BOUNDARY if a floor obstructs the movement, BLOCK if a block obstructs the movement
     */
    checkMoveDown() {
        return this.checkMove(0, 1);
    }
    /**
     * Checks whether the block is able to move by specified deltas
     * @returns ALLOW if the block is able to move by specified deltas, BOUNDARY if a floor obstructs the movement, BLOCK if a block obstructs the movement
     */
    checkMove(dx, dy) {
        const field = GameProcess.getCurrentProcess().field;
        const newSectionX = this.getSectionX() + dx;
        const newSectionY = this.getSectionY() + dy;
        for (const block of field.blocks) {
            if (newSectionX == block.section.x && newSectionY == block.section.y)
                return MoveResult.BLOCK;
        }
        if (field.isSectionInside(newSectionX, newSectionY))
            return MoveResult.ALLOW;
        return MoveResult.BOUNDARY;
    }
    getRealX() {
        const process = GameProcess.getCurrentProcess();
        return this.getSectionX() * process.field.realSectionSize + process.field.getRealFieldX();
    }
    getRealY() {
        const process = GameProcess.getCurrentProcess();
        return this.getSectionY() * process.field.realSectionSize + process.field.getRealFieldY();
    }
    getSectionX() {
        return this.x + this._figure.sectionX;
    }
    getSectionY() {
        return this.y + this._figure.sectionY;
    }
    getShadowSectionY() {
        return this.y + this._figure.getShadowSectionY();
    }
    getRealShadowY() {
        const process = GameProcess.getCurrentProcess();
        return process.field.getRealFieldY() + this.getShadowSectionY() * process.field.realSectionSize;
    }
    checkRotation() {
        const field = GameProcess.getCurrentProcess().field;
        const rotatedFieldX = this.findRotatedRelativeX() + this._figure.sectionX;
        const rotatedFieldY = this.findRotatedRelativeY() + this._figure.sectionY;
        if (!field.isSectionInsideOrAbove(rotatedFieldX, rotatedFieldY))
            return MoveResult.BOUNDARY;
        for (const field_block of field.blocks) {
            if (field_block.getFieldSectionX() == rotatedFieldX && field_block.getFieldSectionY() == rotatedFieldY)
                return MoveResult.BLOCK;
        }
        return MoveResult.ALLOW;
    }
    findRotatedRelativeX() {
        const originY = this.y - this._figure.rotationCenterY;
        const rotatedOriginX = -originY;
        return rotatedOriginX + this._figure.rotationCenterX;
    }
    findRotatedRelativeY() {
        const originX = this.x - this._figure.rotationCenterX;
        const rotatedOriginY = originX;
        return rotatedOriginY + this._figure.rotationCenterY;
    }
    rotateNoRestrictions() {
        const rotatedX = this.findRotatedRelativeX();
        const rotatedY = this.findRotatedRelativeY();
        this.x = rotatedX;
        this.y = rotatedY;
    }
    getRelativeX() {
        return this.x;
    }
    getRelativeY() {
        return this.y;
    }
    getPreviewRealX() {
        return this.x * GameProcess.getCurrentProcess().field.realSectionSize + this._figure.getPreviewRealX();
    }
    getPreviewRealY() {
        return this.y * GameProcess.getCurrentProcess().field.realSectionSize + this._figure.getPreviewRealY();
    }
    /**
     * Creates a field block with the same coordinates and color
     * @returns A new field block
     */
    toFieldBlock() {
        const fieldBlock = new FieldBlock(this.getSectionX(), this.getSectionY());
        fieldBlock.color = this.getColor();
        return fieldBlock;
    }
    drawAsPreview(context) {
        const startX = this.getPreviewRealX() + 0.5;
        const startY = this.getPreviewRealY() + 0.5;
        this.prepareContextPath(startX, startY, context);
        this.fillBlock(this.getColor().rgbString, context);
        this.outlineBlock(context);
    }
    draw(context) {
        super.draw(context);
    }
    drawShadow(context) {
        const shadowSectionY = this.getShadowSectionY();
        const currentSectionY = this.getSectionY();
        if (shadowSectionY != currentSectionY) {
            const shadowRealX = this.getRealX() + 0.5;
            const shadowRealY = this.getRealShadowY() + 0.5;
            this.prepareContextPath(shadowRealX, shadowRealY, context);
            this.fillBlock("rgb(230, 230, 230)", context);
            this.outlineBlock(context);
        }
    }
}
export var MoveResult;
(function (MoveResult) {
    /**
     * Block is able to move
     */
    MoveResult[MoveResult["ALLOW"] = 0] = "ALLOW";
    /**
     * Movement is obstructed by a wall or a floor
     */
    MoveResult[MoveResult["BOUNDARY"] = 1] = "BOUNDARY";
    /**
     * Movement is obstucted by another block
     */
    MoveResult[MoveResult["BLOCK"] = 2] = "BLOCK";
})(MoveResult || (MoveResult = {}));
//# sourceMappingURL=block.js.map