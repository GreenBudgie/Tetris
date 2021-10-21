import { FigureBlock, MoveResult } from "./block.js";
import { getRandomColor } from "./color.js";
import InputHandler, { KeyBindings } from "./input_handler.js";
import Tetris from "./tetris.js";
/**
 * A figure is a collection of single blocks.
 * The figure itself does not contain a location, the blocks do.
 */
export default class Figure {
    constructor(blocks) {
        this.section_x = 0;
        this.section_y = 0;
        this.max_falling_time = 45;
        this.falling_timer = this.max_falling_time;
        this._blocks = blocks;
        this.color = getRandomColor();
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
        this.falling_timer = this.max_falling_time;
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
        this.section_x += dx;
        this.section_y += dy;
    }
    /**
     * Interrupts the falling
     */
    land() {
        Tetris.instance.current_level.field.landFigure();
    }
    update(delta) {
        this.movementHandle();
        this.falling_timer -= delta * Tetris.FPS;
        if (this.falling_timer <= 0) {
            this.moveDownOrStop();
            this.falling_timer = this.max_falling_time;
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
    draw() {
        const drawShadow = this.needsToDrawShadow();
        for (const block of this._blocks) {
            block.draw();
            if (drawShadow) {
                block.drawShadow();
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
        for (let y_shift = 1;; y_shift++) {
            for (const block of this._blocks) {
                if (block.checkMove(0, y_shift) != MoveResult.ALLOW) {
                    return this.section_y + y_shift - 1;
                }
            }
        }
    }
}
export class FigurePattern {
    constructor() {
        this.shape = [];
    }
    static builder() {
        return new FigurePattern();
    }
    block(relative_x, relative_y) {
        this.shape.push([relative_x, relative_y]);
        return this;
    }
    rotationCenter(relative_x, relative_y) {
        this.rotation_center = [relative_x, relative_y];
        return this;
    }
    createFigure() {
        const figure = Figure.createByRelativeBlockSections(...this.shape);
        figure.rotation_center_x = this.rotation_center[0];
        figure.rotation_center_y = this.rotation_center[1];
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