import Block from "./block.js";
/**
 * A figure is a collection of blocks.
 */
export class Figure {
    constructor(...blocks) {
        this.blocks = blocks;
    }
    /**
     * Creates a figure based on section coordinates.
     * 0, 0 represents the top-left corner of the figure.
     * @param sections An array of tuples in which the first element is relative section x, the second is relative section y coordinate
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
        this.move(1, 0);
    }
    moveLeft() {
        this.move(-1, 0);
    }
    fall() {
        this.move(0, 1);
    }
    move(dx, dy) {
        for (let block of this.blocks) {
            block.move(block.section_x + dx, block.section_y + dy);
        }
    }
    draw() {
        for (let block of this.blocks) {
            block.draw();
        }
    }
}
//# sourceMappingURL=figure.js.map