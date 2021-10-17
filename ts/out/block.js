import Tetris from "./tetris.js";
export class AbstractBlock {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    draw() {
        const context = Tetris.instance.context;
        const section_size = Tetris.instance.field.real_section_size;
        const start_x = Tetris.instance.field.getRealFieldX() + this.getFieldSectionX() * section_size + 0.5;
        const start_y = Tetris.instance.field.getRealFieldY() + this.getFieldSectionY() * section_size + 0.5;
        context.beginPath();
        context.moveTo(start_x, start_y);
        context.lineTo(start_x + section_size, start_y);
        context.lineTo(start_x + section_size, start_y + section_size);
        context.lineTo(start_x, start_y + section_size);
        context.closePath();
        context.lineWidth = 1;
        context.strokeStyle = 'black';
        context.fillStyle = this.getColor();
        context.stroke();
        context.fill();
    }
}
/**
 * Represents a block that takes place at the field
 */
export class FieldBlock extends AbstractBlock {
    getColor() {
        return this.color;
    }
    moveDown() {
        this.y++;
    }
    getFieldSectionX() {
        return this.x;
    }
    getFieldSectionY() {
        return this.y;
    }
}
/**
 * Represents a block that is attached to a figure
 */
export class FigureBlock extends AbstractBlock {
    getColor() {
        return this.figure.color;
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
        const new_section_x = this.getFieldSectionX() + dx;
        const new_section_y = this.getFieldSectionY() + dy;
        for (const block of Tetris.instance.field.blocks) {
            if (new_section_x == block.getFieldSectionX() && new_section_y == block.getFieldSectionY())
                return MoveResult.BLOCK;
        }
        if (Tetris.instance.field.isSectionInside(new_section_x, new_section_y))
            return MoveResult.ALLOW;
        return MoveResult.BOUNDARY;
    }
    getFieldSectionX() {
        return this.x + this.figure.section_x;
    }
    getFieldSectionY() {
        return this.y + this.figure.section_y;
    }
    rotateAroundFigureCenter() {
        const origin_x = this.x - this.figure.rotation_center_x;
        const origin_y = this.y - this.figure.rotation_center_y;
        const rotated_origin_x = -origin_y;
        const rotated_origin_y = origin_x;
        this.x = rotated_origin_x + this.figure.rotation_center_x;
        this.y = rotated_origin_y + this.figure.rotation_center_y;
    }
    getFigureRelativeX() {
        return this.x;
    }
    getFigureRelativeY() {
        return this.y;
    }
    /**
     * Creates a field block with the same coordinates and color
     * @returns A new field block
     */
    toFieldBlock() {
        const field_block = new FieldBlock(this.getFieldSectionX(), this.getFieldSectionY());
        field_block.color = this.getColor();
        return field_block;
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