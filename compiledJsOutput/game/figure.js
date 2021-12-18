import BlockColor from "../color/blockColor.js";
import { FigureBlock, MoveResult } from "./figureBlock.js";
import InputHandler, { KeyBindings } from "../main/inputHandler.js";
import Tetris from "../main/tetris.js";
import GameProcess from "./gameProcess.js";
import Point from "../util/point.js";
import SpriteFigure from "../sprite/spriteFigure.js";
import MoveEffect from "../effect/moveEffect.js";
import Transition from "../effect/transition.js";
import { easeOutQuad } from "../effect/effectEasings.js";
export default class Figure {
    constructor(shape, rotationCenter) {
        this.section = Point.zero();
        this._blocks = [];
        this.maxFallingTime = 45;
        this.fallingTimer = this.maxFallingTime;
        this._rotation = 0;
        this.rotationCenter = rotationCenter;
        this.color = BlockColor.getRandomColor();
        shape.forEach(point => this._blocks.push(new FigureBlock(point.clone(), this)));
        this.sprite = new SpriteFigure(shape);
        this.sprite.blockSize = GameProcess.getCurrentProcess().field.realSectionSize;
        this.sprite.rotationCenter.setPositionTo(this.rotationCenter.clone().moveBy(0.5, 0.5));
        this.sprite.outlineMode = "block";
        this.sprite.outlineWidth = 1;
        this.sprite.getColor().setTo(this.color);
        this.sprite.position.setPositionTo(this.getPreviewRealPosition());
        this.previewSprite = new SpriteFigure(shape);
        this.previewSprite.blockSize = GameProcess.getCurrentProcess().field.realSectionSize;
        this.previewSprite.rotationCenter.setPositionTo(this.rotationCenter);
        this.previewSprite.outlineMode = "block";
        this.previewSprite.outlineWidth = 1;
        this.previewSprite.getColor().setTo(this.color);
        this.previewSprite.position.setPositionTo(this.getPreviewRealPosition());
    }
    getPreviewRealPosition() {
        const process = GameProcess.getCurrentProcess();
        const halfSectionSize = process.field.realSectionSize / 2;
        return process.getPreviewCenterPosition().moveBy(-this.getCurrentWidth() * halfSectionSize, -this.getCurrentHeight() * halfSectionSize);
    }
    getColor() {
        return this.color;
    }
    get rotation() {
        return this._rotation;
    }
    get blocks() {
        return this._blocks;
    }
    getCurrentWidth() {
        let maxRelativeBlockX = 0;
        for (const block of this._blocks) {
            if (block.getRelativeSection().x > maxRelativeBlockX)
                maxRelativeBlockX = block.getRelativeSection().x;
        }
        return maxRelativeBlockX + 1;
    }
    getCurrentHeight() {
        let maxRelativeBlockY = 0;
        for (const block of this._blocks) {
            if (block.getRelativeSection().y > maxRelativeBlockY)
                maxRelativeBlockY = block.getRelativeSection().y;
        }
        return maxRelativeBlockY + 1;
    }
    rotate() {
        for (const block of this._blocks) {
            if (block.checkRotation() != MoveResult.ALLOW)
                return;
        }
        this._rotation = this._rotation + Math.PI / 2;
        this._blocks.forEach(block => block.rotateNoRestrictions());
        this.rotateSpriteWithEffect();
    }
    moveRight() {
        this.moveIfPossibleOrStop(1, 0);
    }
    moveLeft() {
        this.moveIfPossibleOrStop(-1, 0);
    }
    moveDownOrStop() {
        this.fallingTimer = this.maxFallingTime;
        this.moveIfPossibleOrStop(0, 1);
    }
    /**
     * Moves the figure by the specified deltas.
     * Vertical movement obstruction will interrupt figure falling.
     * Horizontal movement obstruction will not interrupt the falling, but the figure won't be moved.
     * @param dx X movement, from -1 to 1
     * @param dy Y movement, from -1 to 1
     */
    moveIfPossibleOrStop(dx, dy) {
        const isVerticalMovement = dy > 0;
        for (const block of this._blocks) {
            const moveResult = block.checkMove(dx, dy);
            if (moveResult != MoveResult.ALLOW) {
                if (isVerticalMovement)
                    this.land();
                return;
            }
        }
        this.moveNoRestrictions(dx, dy);
    }
    getRealPosition() {
        const field = GameProcess.getCurrentProcess().field;
        return new Point(this.section.x * field.realSectionSize + field.getRealFieldPosition().x, this.section.y * field.realSectionSize + field.getRealFieldPosition().y);
    }
    /**
     * Moves all blocks of the figure by the specified deltas ignoring movement restrictions.
     * @param dx X movement
     * @param dy Y movement
     */
    moveNoRestrictions(dx, dy) {
        this.section.moveBy(dx, dy);
        this.moveSpriteWithEffect();
    }
    /**
     * Interrupts the falling
     */
    land() {
        GameProcess.getCurrentProcess().field.landFigure();
    }
    update(delta) {
        this.movementHandle();
        this.fallingTimer -= delta * Tetris.FPS;
        if (this.fallingTimer <= 0) {
            this.moveDownOrStop();
            this.fallingTimer = this.maxFallingTime;
        }
    }
    movementHandle() {
        const handler = InputHandler.getHandler();
        if (handler.isKeyBindingPressedOrRepeats(KeyBindings.FIGURE_MOVE_LEFT)) {
            this.moveLeft();
        }
        if (handler.isKeyBindingPressedOrRepeats(KeyBindings.FIGURE_MOVE_RIGHT)) {
            this.moveRight();
        }
        if (handler.isKeyBindingPressedOrRepeats(KeyBindings.FIGURE_MOVE_DOWN)) {
            this.moveDownOrStop();
        }
        if (handler.isKeyBindingPressedOrRepeats(KeyBindings.FIGURE_ROTATE)) {
            this.rotate();
        }
    }
    drawPreview(context) {
        this.previewSprite.draw(context);
    }
    draw(context) {
        this.sprite.draw(context);
    }
    needsToDrawShadow() {
        for (const currentBlock of this._blocks) {
            const shadowY = currentBlock.getShadowSection().y;
            for (const blockToCheck of this._blocks) {
                if (blockToCheck.getFieldSection().y >= shadowY)
                    return false;
            }
        }
        return true;
    }
    getShadowSection() {
        for (let yShift = 1;; yShift++) {
            for (const block of this._blocks) {
                if (block.checkMove(0, yShift) != MoveResult.ALLOW) {
                    return this.section.clone().moveBy(0, yShift - 1);
                }
            }
        }
    }
    moveSpriteWithEffect() {
        this.moveEffect?.interrupt();
        this.moveEffect = new MoveEffect(this.sprite, this.getRealPosition(), 8);
        this.moveEffect.easing = easeOutQuad;
    }
    rotateSpriteWithEffect() {
        this.rotationTransition?.interrupt();
        this.rotationTransition = new Transition(value => this.sprite.rotation = value, this.sprite.rotation, this._rotation, 8);
        this.rotationTransition.easing = easeOutQuad;
    }
}
export class FigurePattern {
    constructor() {
        this.shape = [];
        this.maxX = 0;
    }
    static builder() {
        return new FigurePattern();
    }
    block(relativeX, relativeY) {
        if (relativeX > this.maxX)
            this.maxX = relativeX;
        this.shape.push(new Point(relativeX, relativeY));
        return this;
    }
    rotationCenter(relativeX, relativeY) {
        this.centerOfRotation = new Point(relativeX, relativeY);
        return this;
    }
    createFigure() {
        const doFlip = Math.random() < 0.5;
        let finalShape = this.shape.map(point => point.clone());
        if (doFlip) {
            finalShape.forEach(point => {
                point.x = this.maxX - point.x;
            });
        }
        const figure = new Figure(finalShape, this.centerOfRotation.clone());
        return figure;
    }
}
export class Figures {
    static register(pattern) {
        Figures.patterns.push(pattern);
        return pattern;
    }
    static createRandomFigure() {
        return Figures.patterns[Math.floor(Math.random() * Figures.patterns.length)].createFigure();
    }
}
Figures.patterns = [];
Figures.T_SHAPE = Figures.register(FigurePattern.builder().block(0, 0).block(1, 0).block(2, 0).block(1, 1).rotationCenter(1, 0));
Figures.BOX_SHAPE = Figures.register(FigurePattern.builder().block(0, 0).block(1, 0).block(0, 1).block(1, 1).rotationCenter(0.5, 0.5));
Figures.L_SHAPE = Figures.register(FigurePattern.builder().block(0, 0).block(1, 0).block(2, 0).block(2, 1).rotationCenter(1, 0));
Figures.I_SHAPE = Figures.register(FigurePattern.builder().block(0, 0).block(1, 0).block(2, 0).block(3, 0).rotationCenter(1.5, 0.5));
Figures.Z_SHAPE = Figures.register(FigurePattern.builder().block(0, 0).block(1, 0).block(1, 1).block(2, 1).rotationCenter(1, 0));
Figures.CORNER_SHAPE = Figures.register(FigurePattern.builder().block(0, 0).block(1, 0).block(1, 1).rotationCenter(0.5, 0.5));
//# sourceMappingURL=figure.js.map