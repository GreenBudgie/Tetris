/**
 * A figure is a collection of parts.
 * Figure has its own section position (x and y), and all parts has coordinates relative to this section
 */
export class Figure {
    Figure(field, ...blocks) {
        this.field = field;
        this.block = blocks;
    }
    /**
     * Moves the figure in any direction by the given deltas if possible.
     * If the figure ends up being outside the field or hits another figure it moves by the maximum amount of sections and stops.
     * @param dx Amount of sections to move the figure by x axis, may be negative
     * @param dy Amount of sections to move the figure by y axis, may be negative
     */
    move(dx, dy) {
    }
    /**
     * Gets the section of the given figure part
     * @param part The given part
     * @returns Absoulte part section coordinates, x and y
     */
    getPartAbsoluteSection(block) {
        return { x: this.x + block.x, y: this.y + block.y };
    }
    /**
     * Checks whether this figure is currently outside the field
     */
    isOutside() {
        return true;
    }
}
//# sourceMappingURL=figures.js.map