import Tetris from "./tetris.js";
/**
 * A block is either a part of a figure attached to other parts, or a fallen block that fills up the field.
 * The block has coordinates relative to a figure.
 */
export default class Block {
    constructor(section_x, section_y, color) {
        this.section_x = section_x;
        this.section_y = section_y;
        if (color == null) {
            this.selectRandomColor();
        }
        else {
            this.color = color;
        }
    }
    selectRandomColor() {
        let colors = [];
        for (let blockColor in BlockColor) {
            colors.push(BlockColor[blockColor]);
        }
        this.color = colors[Math.floor(Math.random() * colors.length)];
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
        const new_section_x = this.section_x + dx;
        const new_section_y = this.section_y + dy;
        for (let block of Tetris.field.blocks) {
            if (new_section_x == block.section_x && new_section_y == block.section_y)
                return MoveResult.BLOCK;
        }
        if (Tetris.field.isSectionInside(new_section_x, new_section_y))
            return MoveResult.ALLOW;
        return MoveResult.BOUNDARY;
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
    /**
     * Moves the block regardless of movement restrictions.
     * This method should be called after the movement checks.
     * @param dx X movement
     * @param dy Y movement
     */
    move(dx, dy) {
        this.section_x += dx;
        this.section_y += dy;
    }
    draw() {
        const context = Tetris.context;
        const section_size = Tetris.field.real_section_size;
        const start_x = Tetris.field.getRealFieldX() + this.section_x * section_size + 0.5;
        const start_y = Tetris.field.getRealFieldY() + this.section_y * section_size + 0.5;
        context.beginPath();
        context.moveTo(start_x, start_y);
        context.lineTo(start_x + section_size, start_y);
        context.lineTo(start_x + section_size, start_y + section_size);
        context.lineTo(start_x, start_y + section_size);
        context.closePath();
        context.lineWidth = 1;
        context.strokeStyle = 'black';
        context.fillStyle = this.color;
        context.stroke();
        context.fill();
    }
}
export var BlockColor;
(function (BlockColor) {
    BlockColor["RED"] = "rgb(255, 86, 86)";
    BlockColor["GREEN"] = "rgb(132, 255, 92)";
    BlockColor["BLUE"] = "rgb(73, 63, 251)";
    BlockColor["PINK"] = "rgb(254, 102, 255)";
    BlockColor["YELLOW"] = "rgb(255, 251, 97)";
    BlockColor["ORANGE"] = "rgb(255, 151, 70)";
})(BlockColor || (BlockColor = {}));
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