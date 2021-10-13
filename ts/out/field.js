import Tetris from "./tetris.js";
export default class Field {
    constructor() {
        this.sections_x = 14;
        this.sections_y = 20;
        this.section_size_pixels = 28;
    }
    getRealFieldWidth() {
        return this.section_size_pixels * this.sections_x;
    }
    getRealFieldHeight() {
        return this.section_size_pixels * this.sections_y;
    }
    draw() {
        const context = Tetris.getTetris().getContext();
        this.drawSections(context);
        this.drawBlocks(context);
    }
    drawSections(context) {
        context.beginPath();
        for (let x_section = 0; x_section <= this.sections_x; x_section++) {
            context.moveTo(x_section * this.section_size_pixels, 0);
            context.lineTo(x_section * this.section_size_pixels, this.getRealFieldHeight());
        }
        for (let y_section = 0; y_section <= this.sections_y; y_section++) {
            context.moveTo(0, y_section * this.section_size_pixels);
            context.lineTo(this.getRealFieldWidth(), y_section * this.section_size_pixels);
        }
        context.closePath();
        context.stroke();
    }
    drawBlocks(context) {
    }
}
//# sourceMappingURL=field.js.map