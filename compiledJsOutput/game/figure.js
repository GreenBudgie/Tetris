import BlockColor from "../color/blockColor.js";
import StateHandler from "../state/stateHandler.js";
import { FigureBlock, MoveResult } from "./block.js";
import InputHandler, { KeyBindings } from "./inputHandler.js";
import Tetris from "./tetris.js";
/**
 * A figure is a collection of single blocks
 */
export default class Figure {
    constructor(blocks) {
        this.sectionX = 0;
        this.sectionY = 0;
        this.maxFallingTime = 45;
        this.fallingTimer = this.maxFallingTime;
        this._blocks = blocks;
        this.color = BlockColor.getRandomColor();
        this._blocks.forEach(block => {
            block.figure = this;
        });
    }
    /**
     * Creates a figure based on section coordinates.
     * 0, 0 represents the top-left corner of the figure.
     * @param sections An array of tuples in which the first element is relative section x, the second is relative section y coordinate
     * @example An input "[0, 0], [1, 0], [2, 0], [1, 1]" will create a T-shaped figure
     * @returns A figure with currently defined blocks
     */
    static createByRelativeBlockSections(...sections) {
        const blocks = [];
        for (let section of sections) {
            blocks.push(new FigureBlock(section[0], section[1]));
        }
        return new Figure(blocks);
    }
    getPreviewRealX() {
        const level = StateHandler.getHandler().GAME.level;
        return level.getLeftSideMiddle() - (this.getCurrentWidth() * level.field.realSectionSize) / 2;
    }
    getPreviewRealY() {
        return StateHandler.getHandler().GAME.level.field.getRealFieldY() + 60;
    }
    getColor() {
        return this.color;
    }
    get blocks() {
        return this._blocks;
    }
    getCurrentWidth() {
        let maxRelativeBlockX = 0;
        for (const block of this._blocks) {
            if (block.getRelativeX() > maxRelativeBlockX)
                maxRelativeBlockX = block.getRelativeX();
        }
        return maxRelativeBlockX + 1;
    }
    getCurrentHeight() {
        let maxRelativeBlockY = 0;
        for (const block of this._blocks) {
            if (block.getRelativeY() > maxRelativeBlockY)
                maxRelativeBlockY = block.getRelativeY();
        }
        return maxRelativeBlockY + 1;
    }
    rotate() {
        for (const block of this._blocks) {
            if (block.checkRotation() != MoveResult.ALLOW)
                return;
        }
        this._blocks.forEach(block => block.rotateNoRestrictions());
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
    /**
     * Moves all blocks of the figure by the specified deltas ignoring movement restrictions.
     * @param dx X movement
     * @param dy Y movement
     */
    moveNoRestrictions(dx, dy) {
        this.sectionX += dx;
        this.sectionY += dy;
    }
    /**
     * Interrupts the falling
     */
    land() {
        StateHandler.getHandler().GAME.level.field.landFigure();
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
    drawAsPreview(context) {
        for (const block of this._blocks) {
            block.drawAsPreview(context);
        }
    }
    draw(context) {
        const drawShadow = this.needsToDrawShadow();
        for (const block of this._blocks) {
            block.draw(context);
            if (drawShadow) {
                block.drawShadow(context);
            }
        }
    }
    needsToDrawShadow() {
        for (const currentBlock of this._blocks) {
            const shadowY = currentBlock.getShadowSectionY();
            for (const blockToCheck of this._blocks) {
                if (blockToCheck.getSectionY() >= shadowY)
                    return false;
            }
        }
        return true;
    }
    getShadowSectionY() {
        for (let yShift = 1;; yShift++) {
            for (const block of this._blocks) {
                if (block.checkMove(0, yShift) != MoveResult.ALLOW) {
                    return this.sectionY + yShift - 1;
                }
            }
        }
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
    block(relative_x, relative_y) {
        if (relative_x > this.maxX)
            this.maxX = relative_x;
        this.shape.push([relative_x, relative_y]);
        return this;
    }
    rotationCenter(relative_x, relative_y) {
        this.centerOfRotation = [relative_x, relative_y];
        return this;
    }
    createFigure() {
        const doFlip = Math.random() < 0.5;
        let finalShape = [];
        this.shape.forEach((coords) => {
            finalShape.push([coords[0], coords[1]]);
        });
        if (doFlip) {
            finalShape.forEach((coords) => {
                coords[0] = this.maxX - coords[0];
            });
        }
        const figure = Figure.createByRelativeBlockSections(...finalShape);
        figure.rotationCenterX = this.centerOfRotation[0];
        figure.rotationCenterY = this.centerOfRotation[1];
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