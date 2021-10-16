import Block, { MoveResult } from "./block.js";
import InputHandler, { KeyBindings } from "./input_handler.js";
/**
 * A figure is a collection of single blocks.
 * The figure itself does not contain a location, the blocks do.
 */
export default class Figure {
    constructor(...blocks) {
        this.blocks = blocks;
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
    update() {
        this.movementHandle();
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
//# sourceMappingURL=figure.js.map