import { easeOutQuad } from "../effect/effectEasings.js";
import MoveEffect from "../effect/moveEffect.js";
import Transition from "../effect/transition.js";
import SpriteBlock from "../sprite/spriteBlock.js";
import Point from "../util/point.js";
import GameProcess from "./gameProcess.js";
export class AbstractBlock {
    constructor(section) {
        this.section = section;
        this.sprite = new SpriteBlock();
        this.sprite.size = GameProcess.getCurrentProcess().field.realSectionSize;
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
    getFieldSection() {
        return this.section;
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
        this.sprite.rotationCenter.setPositionTo(this._figure.rotationCenter.clone().add(this.section));
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
        const newSection = this.getFieldSection().clone().moveBy(dx, dy);
        for (const block of field.blocks) {
            if (newSection.x == block.getFieldSection().x && newSection.y == block.getFieldSection().y)
                return MoveResult.BLOCK;
        }
        if (field.isSectionInside(newSection))
            return MoveResult.ALLOW;
        return MoveResult.BOUNDARY;
    }
    getFieldSection() {
        return this.section.clone().add(this._figure.section);
    }
    getRealPosition() {
        const field = GameProcess.getCurrentProcess().field;
        return new Point(this.getFieldSection().x * field.realSectionSize + field.getRealFieldPosition().x, this.getFieldSection().y * field.realSectionSize + field.getRealFieldPosition().y);
    }
    getShadowSection() {
        return this._figure.getShadowSection().add(this._figure.section);
    }
    getRealShadowPosition() {
        const process = GameProcess.getCurrentProcess();
        return new Point(process.field.getRealFieldPosition().x + this.getShadowSection().x * process.field.realSectionSize, process.field.getRealFieldPosition().y + this.getShadowSection().y * process.field.realSectionSize);
    }
    checkRotation() {
        const field = GameProcess.getCurrentProcess().field;
        const rotatedFieldSection = this.findRotatedRelativeSection().add(this._figure.section);
        if (!field.isSectionInsideOrAbove(rotatedFieldSection))
            return MoveResult.BOUNDARY;
        for (const field_block of field.blocks) {
            if (field_block.getFieldSection().equals(rotatedFieldSection))
                return MoveResult.BLOCK;
        }
        return MoveResult.ALLOW;
    }
    findRotatedRelativeSection() {
        const origin = this.section.clone().subtract(this._figure.rotationCenter);
        const rotatedOrigin = new Point(-origin.y, origin.x);
        return rotatedOrigin.add(this._figure.rotationCenter);
    }
    rotateNoRestrictions() {
        this.section.setPositionTo(this.findRotatedRelativeSection());
        this.rotateSpriteWithEffect();
    }
    getRelativeSection() {
        return this.section;
    }
    /**
     * Creates a field block with the same coordinates and color
     * @returns A new field block
     */
    toFieldBlock() {
        const fieldBlock = new FieldBlock(this.getFieldSection());
        fieldBlock.sprite.getColor().setTo(this.sprite.getColor());
        return fieldBlock;
    }
    updateSpritePosition() {
        this.sprite.position.setPositionTo(this.getRealPosition());
    }
    moveSpriteWithEffect() {
        if (this.moveEffect != null)
            this.moveEffect.interruptNoCallback();
        this.moveEffect = new MoveEffect(this.sprite, this.getRealPosition(), 20);
        this.moveEffect.easing = easeOutQuad;
    }
    rotateSpriteWithEffect() {
        if (this.rotationEffect != null)
            this.rotationEffect.interruptNoCallback();
        this.rotationEffect = new Transition(value => this.sprite.rotation = value, this.sprite.rotation, this.sprite.rotation + Math.PI / 2, 20);
        this.rotationEffect.easing = easeOutQuad;
    }
    draw(context) {
        super.draw(context);
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