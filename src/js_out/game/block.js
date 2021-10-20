import Tetris from "./tetris.js";
export class AbstractBlock {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    getRealFieldX() {
        return Tetris.instance.current_level.field.getRealFieldX() +
            this.getFieldSectionX() * Tetris.instance.current_level.field.real_section_size;
    }
    getRealFieldY() {
        return Tetris.instance.current_level.field.getRealFieldY() +
            this.getFieldSectionY() * Tetris.instance.current_level.field.real_section_size;
    }
    draw() {
        const field = Tetris.instance.current_level.field;
        const section_size = field.real_section_size;
        const block_start_x = this.getRealFieldX() + 0.5;
        const block_start_y = this.getRealFieldY() + 0.5;
        this.drawOutlineAndFill(block_start_x, block_start_y, this.getColor());
    }
    drawOutlineAndFill(start_x, start_y, color) {
        const context = Tetris.instance.context;
        const section_size = Tetris.instance.current_level.field.real_section_size;
        context.beginPath();
        context.moveTo(start_x, start_y);
        context.lineTo(start_x + section_size, start_y);
        context.lineTo(start_x + section_size, start_y + section_size);
        context.lineTo(start_x, start_y + section_size);
        context.closePath();
        context.lineWidth = 1;
        context.strokeStyle = 'black';
        context.fillStyle = color;
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
        const field = Tetris.instance.current_level.field;
        const new_section_x = this.getFieldSectionX() + dx;
        const new_section_y = this.getFieldSectionY() + dy;
        for (const block of field.blocks) {
            if (new_section_x == block.getFieldSectionX() && new_section_y == block.getFieldSectionY())
                return MoveResult.BLOCK;
        }
        if (field.isSectionInside(new_section_x, new_section_y))
            return MoveResult.ALLOW;
        return MoveResult.BOUNDARY;
    }
    getFieldSectionX() {
        return this.x + this.figure.section_x;
    }
    getFieldSectionY() {
        return this.y + this.figure.section_y;
    }
    getFieldShadowSectionY() {
        return this.y + this.figure.getShadowSectionY();
    }
    getRealShadowY() {
        return Tetris.instance.current_level.field.getRealFieldY() +
            this.getFieldShadowSectionY() * Tetris.instance.current_level.field.real_section_size;
    }
    checkRotation() {
        const field = Tetris.instance.current_level.field;
        const rotated_field_x = this.findRotatedRelativeX() + this.figure.section_x;
        const rotated_field_y = this.findRotatedRelativeY() + this.figure.section_y;
        if (!field.isSectionInside(rotated_field_x, rotated_field_y))
            return MoveResult.BOUNDARY;
        for (const field_block of field.blocks) {
            if (field_block.getFieldSectionX() == rotated_field_x && field_block.getFieldSectionY() == rotated_field_y)
                return MoveResult.BLOCK;
        }
        return MoveResult.ALLOW;
    }
    findRotatedRelativeX() {
        const origin_y = this.y - this.figure.rotation_center_y;
        const rotated_origin_x = -origin_y;
        return rotated_origin_x + this.figure.rotation_center_x;
    }
    findRotatedRelativeY() {
        const origin_x = this.x - this.figure.rotation_center_x;
        const rotated_origin_y = origin_x;
        return rotated_origin_y + this.figure.rotation_center_y;
    }
    rotateNoRestrictions() {
        const rotated_x = this.findRotatedRelativeX();
        const rotated_y = this.findRotatedRelativeY();
        this.x = rotated_x;
        this.y = rotated_y;
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
    draw() {
        const shadow_real_x = this.getRealFieldX() + 0.5;
        const shadow_real_y = this.getRealShadowY() + 0.5;
        this.drawOutlineAndFill(shadow_real_x, shadow_real_y, "rgb(230, 230, 230)");
        super.draw();
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