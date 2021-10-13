export default class Field {
    constructor() {
        this.sections_x = 8;
        this.sections_y = 12;
        this.section_size_pixels = 48;
    }
    getRealCanvasWidth() {
        return this.section_size_pixels * this.sections_x;
    }
    getRealCanvasHeight() {
        return this.section_size_pixels * this.sections_y;
    }
    draw(context) {
        context.clearRect;
        this.drawSections(context);
        this.drawBlocks(context);
    }
    drawSections(context) {
    }
    drawBlocks(context) {
    }
}
//# sourceMappingURL=field.js.map