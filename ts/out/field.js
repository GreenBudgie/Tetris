import Block from "./block.js";
import Tetris from "./tetris.js";
/**
 * A field is a game element that stores and renders all the blocks and figures inside it
 */
export default class Field {
    constructor() {
        this.sections_x = 12;
        this.sections_y = 20;
        this.real_section_size = 28;
        this.blocks = [];
        this.blocks.push(new Block(1, 1));
        this.blocks.push(new Block(5, 7));
    }
    getRealFieldX() {
        return Tetris.window_width / 2 - Tetris.field.getRealFieldWidth() / 2;
    }
    getRealFieldY() {
        return Tetris.window_height / 2 - Tetris.field.getRealFieldHeight() / 2;
    }
    getRealFieldWidth() {
        return this.real_section_size * this.sections_x;
    }
    getRealFieldHeight() {
        return this.real_section_size * this.sections_y;
    }
    isSectionInside(section_x, section_y) {
        return section_x >= 0 && section_x <= this.sections_x && section_y >= 0 && section_y <= this.sections_y;
    }
    draw() {
        this.drawSections();
        this.drawBlocks();
    }
    drawSections() {
        const context = Tetris.context;
        const start_x = this.getRealFieldX();
        const start_y = this.getRealFieldY();
        context.strokeStyle = 'rgb(189, 189, 189)';
        context.lineWidth = 1;
        context.beginPath();
        for (let x_section = 0; x_section <= this.sections_x; x_section++) {
            context.moveTo(start_x + x_section * this.real_section_size + 0.5, start_y);
            context.lineTo(start_x + x_section * this.real_section_size + 0.5, start_y + this.getRealFieldHeight());
        }
        for (let y_section = 0; y_section <= this.sections_y; y_section++) {
            context.moveTo(start_x, start_y + y_section * this.real_section_size + 0.5);
            context.lineTo(start_x + this.getRealFieldWidth(), start_y + y_section * this.real_section_size + 0.5);
        }
        context.closePath();
        context.stroke();
    }
    drawBlocks() {
        for (let block of this.blocks) {
            block.draw();
        }
    }
}
//# sourceMappingURL=field.js.map