import GameProcess from "./gameProcess.js";
export class AbstractBlock {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    update(delta) { }
    draw(context) {
        const blockStartX = this.getRealX() + 0.5;
        const blockStartY = this.getRealY() + 0.5;
        this.prepareContextPath(blockStartX, blockStartY, context);
        this.fillBlock(this.getColor().rgbString, context);
        this.outlineBlock(context);
    }
    prepareContextPath(startX, startY, context) {
        const sectionSize = GameProcess.getCurrentProcess().field.realSectionSize;
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(startX + sectionSize, startY);
        context.lineTo(startX + sectionSize, startY + sectionSize);
        context.lineTo(startX, startY + sectionSize);
        context.closePath();
    }
    outlineBlock(context) {
        context.lineWidth = 1;
        context.strokeStyle = 'black';
        context.stroke();
    }
    fillBlock(color, context) {
        context.fillStyle = color;
        context.fill();
    }
}
/**
 * Represents a block that takes place at the field
 */
export class FieldBlock extends AbstractBlock {
    constructor(x, y) {
        super(x, y);
        this.calculateRealX();
        this.calculateRealY();
    }
    getColor() {
        return this.color;
    }
    moveDown() {
        this.y++;
        this.calculateRealY();
    }
    getFieldSectionX() {
        return this.x;
    }
    getFieldSectionY() {
        return this.y;
    }
    calculateRealX() {
        const process = GameProcess.getCurrentProcess();
        this.realX = process.field.getRealFieldX() + this.getFieldSectionX() * process.field.realSectionSize;
    }
    calculateRealY() {
        const process = GameProcess.getCurrentProcess();
        this.realY = process.field.getRealFieldY() + this.getFieldSectionY() * process.field.realSectionSize;
    }
    getRealX() {
        return this.realX;
    }
    getRealY() {
        return this.realY;
    }
}
/**
 * Represents a block that is attached to a figure
 */
export class FigureBlock extends AbstractBlock {
    getColor() {
        return this.figure.color;
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
            if (newSectionX == block.getFieldSectionX() && newSectionY == block.getFieldSectionY())
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
        return this.x + this.figure.sectionX;
    }
    getSectionY() {
        return this.y + this.figure.sectionY;
    }
    getShadowSectionY() {
        return this.y + this.figure.getShadowSectionY();
    }
    getRealShadowY() {
        const process = GameProcess.getCurrentProcess();
        return process.field.getRealFieldY() + this.getShadowSectionY() * process.field.realSectionSize;
    }
    checkRotation() {
        const field = GameProcess.getCurrentProcess().field;
        const rotatedFieldX = this.findRotatedRelativeX() + this.figure.sectionX;
        const rotatedFieldY = this.findRotatedRelativeY() + this.figure.sectionY;
        if (!field.isSectionInside(rotatedFieldX, rotatedFieldY))
            return MoveResult.BOUNDARY;
        for (const field_block of field.blocks) {
            if (field_block.getFieldSectionX() == rotatedFieldX && field_block.getFieldSectionY() == rotatedFieldY)
                return MoveResult.BLOCK;
        }
        return MoveResult.ALLOW;
    }
    findRotatedRelativeX() {
        const originY = this.y - this.figure.rotationCenterY;
        const rotatedOriginX = -originY;
        return rotatedOriginX + this.figure.rotationCenterX;
    }
    findRotatedRelativeY() {
        const originX = this.x - this.figure.rotationCenterX;
        const rotatedOriginY = originX;
        return rotatedOriginY + this.figure.rotationCenterY;
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
        return this.x * GameProcess.getCurrentProcess().field.realSectionSize + this.figure.getPreviewRealX();
    }
    getPreviewRealY() {
        return this.y * GameProcess.getCurrentProcess().field.realSectionSize + this.figure.getPreviewRealY();
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