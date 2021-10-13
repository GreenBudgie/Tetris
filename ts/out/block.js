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
    overlaps(another_block) {
        return this.section_x == another_block.section_x && this.section_y == another_block.section_y;
    }
    checkMoveRight() {
        return this.checkHorizontalMove(this.section_x + 1);
    }
    checkMoveLeft() {
        return this.checkHorizontalMove(this.section_x - 1);
    }
    checkHorizontalMove(new_section_x) {
        for (let block of Tetris.field.blocks) {
            if (block.overlaps(this))
                return HorizontalMoveResult.BLOCK_TOUCH;
        }
        if (Tetris.field.isSectionInside(new_section_x, this.section_y))
            return HorizontalMoveResult.ALLOW;
        return HorizontalMoveResult.WALL;
    }
    checkMoveDown() {
        if (Tetris.field.isSectionInside(this.section_x, this.section_y + 1))
            return VerticalMoveResult.ALLOW;
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
export var HorizontalMoveResult;
(function (HorizontalMoveResult) {
    HorizontalMoveResult[HorizontalMoveResult["ALLOW"] = 0] = "ALLOW";
    HorizontalMoveResult[HorizontalMoveResult["WALL"] = 1] = "WALL";
    HorizontalMoveResult[HorizontalMoveResult["BLOCK_TOUCH"] = 2] = "BLOCK_TOUCH";
})(HorizontalMoveResult || (HorizontalMoveResult = {}));
export var VerticalMoveResult;
(function (VerticalMoveResult) {
    VerticalMoveResult[VerticalMoveResult["ALLOW"] = 0] = "ALLOW";
    VerticalMoveResult[VerticalMoveResult["FLOOR"] = 1] = "FLOOR";
    VerticalMoveResult[VerticalMoveResult["BLOCK_LAND"] = 2] = "BLOCK_LAND";
})(VerticalMoveResult || (VerticalMoveResult = {}));
//# sourceMappingURL=block.js.map