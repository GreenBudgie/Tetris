import Block, { MoveResult } from "./block.js";
import InputHandler, { KeyBindings } from "./input_handler.js";
import Tetris from "./tetris.js";
/**
 * A figure is a collection of single blocks.
 * The figure itself does not contain a location, the blocks do.
 */
export default class Figure {
    constructor(...blocks) {
        this.max_falling_time = 60;
        this.falling_timer = this.max_falling_time;
        this.blocks = blocks;
        this.selectRandomColor();
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
            blocks.push(new Block(section[0], section[1]));
        }
        return new Figure(...blocks);
    }
    selectRandomColor() {
        let colors = [];
        for (const figureColor in FigureColor) {
            colors.push(FigureColor[figureColor]);
        }
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.blocks.forEach(block => block.color = this.color);
    }
    moveRight() {
        this.moveIfPossibleOrStop(1, 0);
    }
    moveLeft() {
        this.moveIfPossibleOrStop(-1, 0);
    }
    moveDownOrStop() {
        this.moveIfPossibleOrStop(0, 1);
    }
    /**
     * Moves all blocks of the figure by the specified deltas.
     * Vertical movement obstruction will interrupt figure falling.
     * Horizontal movement obstruction will not interrupt the falling, but the figure won't be moved.
     * @param dx X movement, from -1 to 1
     * @param dy Y movement, from -1 to 1
     */
    moveIfPossibleOrStop(dx, dy) {
        const isVerticalMovement = dy > 0;
        for (const block of this.blocks) {
            const moveResult = block.checkMove(dx, dy);
            if (moveResult != MoveResult.ALLOW) {
                if (isVerticalMovement)
                    this.stop();
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
        for (const block of this.blocks) {
            block.move(dx, dy);
        }
    }
    /**
     * Interrupts the falling
     */
    stop() {
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
        if (InputHandler.getHandler().isKeyBindingPressedOrRepeats(KeyBindings.FIGURE_MOVE_LEFT)) {
            this.moveLeft();
        }
        if (InputHandler.getHandler().isKeyBindingPressedOrRepeats(KeyBindings.FIGURE_MOVE_RIGHT)) {
            this.moveRight();
        }
    }
    draw() {
        for (let block of this.blocks) {
            block.draw();
        }
    }
}
export var FigureColor;
(function (FigureColor) {
    FigureColor["RED"] = "rgb(255, 86, 86)";
    FigureColor["GREEN"] = "rgb(132, 255, 92)";
    FigureColor["BLUE"] = "rgb(73, 63, 251)";
    FigureColor["PINK"] = "rgb(254, 102, 255)";
    FigureColor["YELLOW"] = "rgb(255, 251, 97)";
    FigureColor["ORANGE"] = "rgb(255, 151, 70)";
})(FigureColor || (FigureColor = {}));
//# sourceMappingURL=figure.js.map