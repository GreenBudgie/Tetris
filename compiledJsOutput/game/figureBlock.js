import Point from "../util/point.js";
import { FieldBlock } from "./fieldBlock.js";
import GameProcess from "./gameProcess.js";
/**
 * Represents a block that is attached to a figure
 */
export class FigureBlock {
    constructor(relativePosition, figure) {
        this.relativePosition = relativePosition;
        this.figure = figure;
    }
    checkMoveRight() {
        return this.checkMove(1, 0);
    }
    checkMoveLeft() {
        return this.checkMove(-1, 0);
    }
    checkMoveDown() {
        return this.checkMove(0, 1);
    }
    /**
     * Checks whether the block is able to move by specified deltas
     * @returns ALLOW if the block is able to move by specified deltas, BOUNDARY if a floor obstructs the movement, BLOCK if a block obstructs the movement
     */
    checkMove(dx, dy) {
        const field = GameProcess.getCurrentProcess().field;
        const newSection = this.getFieldSection().clone().moveBy(dx, dy);
        for (const block of field.blocks) {
            if (newSection.x == block.section.x && newSection.y == block.section.y)
                return MoveResult.BLOCK;
        }
        if (field.isSectionInside(newSection))
            return MoveResult.ALLOW;
        return MoveResult.BOUNDARY;
    }
    getFieldSection() {
        return this.relativePosition.clone().add(this.figure.section);
    }
    getRealPosition() {
        const field = GameProcess.getCurrentProcess().field;
        return new Point(this.getFieldSection().x * field.realSectionSize + field.getRealFieldPosition().x, this.getFieldSection().y * field.realSectionSize + field.getRealFieldPosition().y);
    }
    getShadowSection() {
        return this.figure.getShadowSection().add(this.figure.section);
    }
    getRealShadowPosition() {
        const process = GameProcess.getCurrentProcess();
        return new Point(process.field.getRealFieldPosition().x + this.getShadowSection().x * process.field.realSectionSize, process.field.getRealFieldPosition().y + this.getShadowSection().y * process.field.realSectionSize);
    }
    checkRotation() {
        const field = GameProcess.getCurrentProcess().field;
        const rotatedFieldSection = this.findRotatedRelativeSection().add(this.figure.section);
        if (!field.isSectionInsideOrAbove(rotatedFieldSection))
            return MoveResult.BOUNDARY;
        for (const field_block of field.blocks) {
            if (field_block.section.equals(rotatedFieldSection))
                return MoveResult.BLOCK;
        }
        return MoveResult.ALLOW;
    }
    findRotatedRelativeSection() {
        const origin = this.relativePosition.clone().subtract(this.figure.rotationCenter);
        const rotatedOrigin = new Point(-origin.y, origin.x);
        return rotatedOrigin.add(this.figure.rotationCenter);
    }
    rotateNoRestrictions() {
        this.relativePosition.setPositionTo(this.findRotatedRelativeSection());
    }
    getRelativeSection() {
        return this.relativePosition;
    }
    /**
     * Creates a field block with the same coordinates and color
     * @returns A new field block
     */
    toFieldBlock() {
        const fieldBlock = new FieldBlock(this.getFieldSection());
        fieldBlock.sprite.getColor().setTo(this.figure.sprite.getColor());
        return fieldBlock;
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
//# sourceMappingURL=figureBlock.js.map