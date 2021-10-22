import { Figures } from "./figure.js";
import Tetris from "./tetris.js";
/**
 * A field is a game element that stores and renders all the blocks and figures inside it
 */
export default class Field {
    constructor(sections_x, sections_y) {
        /**
         * The actual size of each section measured in pixels
         */
        this.real_section_size = 28;
        /**
         * The amount of sections above the playable area
         */
        this.limit_sections = 3;
        this.blocks = [];
        this.max_time_to_create_new_figure = 15;
        this.time_to_create_new_figure = this.max_time_to_create_new_figure;
        this.sections_x = sections_x;
        this.sections_y = sections_y;
        this.createFallingFigure(Figures.createRandomFigure());
    }
    static defaultSizeField() {
        return new Field(12, 20);
    }
    getRealFieldX() {
        return Math.round(Tetris.instance.window_width / 2 - this.getRealFieldWidth() / 2);
    }
    getRealFieldY() {
        return Math.round(Tetris.instance.window_height / 2 - this.getRealFieldHeight() / 2);
    }
    getRealFieldWidth() {
        return this.real_section_size * this.sections_x;
    }
    getRealFieldHeight() {
        return this.real_section_size * this.sections_y;
    }
    createFallingFigure(figure) {
        const half_figure_width = Math.floor(figure.getCurrentWidth() / 2);
        const half_field_width = Math.floor(this.sections_x / 2);
        figure.moveNoRestrictions(half_field_width - half_figure_width, 0);
        this.falling_figure = figure;
    }
    landFigure() {
        for (const figure_block of this.falling_figure.blocks) {
            this.blocks.push(figure_block.toFieldBlock());
        }
        this.falling_figure = null;
        this.time_to_create_new_figure = this.max_time_to_create_new_figure;
        this.removeFullRowsAndGrantPoints();
    }
    removeFullRowsAndGrantPoints() {
        row_loop: for (let y = 0; y < this.sections_y; y++) {
            for (let x = 0; x < this.sections_x; x++) {
                const field_block = this.getBlockAt(x, y);
                if (field_block == null) {
                    continue row_loop;
                }
            }
            Tetris.instance.current_level.points += this.sections_x;
            Tetris.instance.current_level.filled_rows++;
            this.blocks = this.blocks.filter(block => block.getFieldSectionY() != y);
            for (const block of this.blocks) {
                if (block.getFieldSectionY() < y)
                    block.moveDown();
            }
        }
    }
    getBlockAt(section_x, section_y) {
        for (const block of this.blocks) {
            if (block.getFieldSectionX() == section_x && block.getFieldSectionY() == section_y)
                return block;
        }
        return null;
    }
    isSectionInside(section_x, section_y) {
        return section_x >= 0 && section_x < this.sections_x && section_y >= 0 && section_y < this.sections_y;
    }
    update(delta) {
        if (this.falling_figure != null) {
            this.falling_figure.update(delta);
        }
        else {
            this.time_to_create_new_figure -= delta * Tetris.FPS;
            if (this.time_to_create_new_figure <= 0) {
                Tetris.instance.current_level.createNextFigureAtField();
                Tetris.instance.current_level.selectNextFigure();
            }
        }
    }
    draw() {
        this.drawSections();
        this.drawBlocks();
        if (this.falling_figure != null)
            this.falling_figure.draw();
    }
    drawSections() {
        const context = Tetris.instance.context;
        const start_x = this.getRealFieldX();
        const start_y = this.getRealFieldY();
        context.strokeStyle = "rgb(189, 189, 189)";
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
        this.blocks.forEach(block => block.draw());
    }
}
//# sourceMappingURL=field.js.map