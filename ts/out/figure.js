import Block, { MoveResult } from "./block.js";
import InputHandler, { KeyBindings } from "./input_handler.js";
import Tetris from "./tetris.js";
/**
 * A figure is a collection of single blocks.
 * The figure itself does not contain a location, the blocks do.
 */
export default class Figure {
    constructor(...blocks) {
        this.max_falling_time = 45;
        this.falling_timer = this.max_falling_time;
        this._blocks = blocks;
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
    get blocks() {
        return this._blocks;
    }
    /**
     * Gets absolute section positions with uttermost blocks with respect to figure rotation.
     * This method uses raw section coordinates, so the boundaries might be shifted to a float value.
     * @returns An object containing absolute section positions with uttermost blocks
     */
    getBoundaries() {
        let minBlockX = 999;
        let maxBlockX = 0;
        let minBlockY = 999;
        let maxBlockY = 0;
        for (const block of this._blocks) {
            if (block.getRawSectionX() > maxBlockX)
                maxBlockX = block.getRawSectionX();
            if (block.getRawSectionX() < minBlockX)
                minBlockX = block.getRawSectionX();
            if (block.getRawSectionY() > maxBlockY)
                maxBlockY = block.getRawSectionY();
            if (block.getRawSectionY() < minBlockY)
                minBlockY = block.getRawSectionY();
        }
        return {
            left: minBlockX,
            top: minBlockY,
            right: maxBlockX,
            bottom: maxBlockY
        };
    }
    /**
     * Gets the current width with respect to figure rotation
     * @returns The width of the figure
     */
    getWidth() {
        const boundaries = this.getBoundaries();
        return boundaries.right - boundaries.left + 1;
    }
    /**
     * Gets the current height with respect to figure rotation
     * @returns The height of the figure
     */
    getHeight() {
        const boundaries = this.getBoundaries();
        return boundaries.bottom - boundaries.top + 1;
    }
    selectRandomColor() {
        let colors = [];
        for (const figureColor in FigureColor) {
            colors.push(FigureColor[figureColor]);
        }
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this._blocks.forEach(block => block.color = this.color);
    }
    rotate() {
        const boundaries = this.getBoundaries();
        const center_x = (boundaries.left + boundaries.right) / 2;
        const center_y = (boundaries.bottom + boundaries.top) / 2;
        for (const block of this._blocks) {
            const origin_x = block.getRawSectionX() - center_x;
            const origin_y = block.getRawSectionY() - center_y;
            const rotated_origin_x = -origin_y;
            const rotated_origin_y = origin_x;
            block.setSectionX(rotated_origin_x + center_x);
            block.setSectionY(rotated_origin_y + center_y);
        }
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
     * Moves all blocks of the figure by the specified deltas.
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
        for (const block of this._blocks) {
            block.move(dx, dy);
        }
    }
    /**
     * Interrupts the falling
     */
    land() {
        Tetris.instance.field.landFigure();
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
        for (let block of this._blocks) {
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
export class Figures {
    static register(...shape) {
        Figures.shapes.push(shape);
        return shape;
    }
    static createRandomFigure() {
        return Figure.createByRelativeBlockSections(...Figures.shapes[Math.floor(Math.random() * Figures.shapes.length)]);
    }
}
Figures.shapes = [];
Figures.T_SHAPE = Figures.register([0, 0], [1, 0], [2, 0], [1, 1]);
Figures.BOX_SHAPE = Figures.register([0, 0], [1, 0], [0, 1], [1, 1]);
Figures.L_SHAPE = Figures.register([0, 0], [1, 0], [2, 0], [2, 1]);
Figures.I_SHAPE = Figures.register([0, 0], [1, 0], [2, 0], [3, 0]);
Figures.Z_SHAPE = Figures.register([0, 0], [1, 0], [1, 1], [2, 1]);
Figures.CORNER_SHAPE = Figures.register([0, 0], [1, 0], [1, 1]);
//# sourceMappingURL=figure.js.map