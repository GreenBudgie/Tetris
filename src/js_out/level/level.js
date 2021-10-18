import Tetris from "../game/tetris.js";
export default class Level {
    constructor() {
        this.filled_rows = 0;
        this.points = 0;
    }
    update(delta) {
        this.field.update(delta);
    }
    draw() {
        this.field.draw();
        this.drawPoints();
    }
    drawPoints() {
        const context = Tetris.instance.context;
        context.font = "36px homespun";
        context.fillStyle = "black";
        context.textBaseline = "top";
        context.textAlign = "center";
        const field_end_x = this.field.getRealFieldX() + this.field.getRealFieldWidth();
        const right_middle = Math.round((field_end_x + Tetris.instance.window_width) / 2);
        const points_y = this.field.getRealFieldY();
        context.fillText("- Points -", right_middle, points_y);
        context.fillText(`${this.points} / ${this.required_points}`, right_middle, points_y + 45);
        const rows_y = points_y + 150;
        context.fillText(`- Rows -`, right_middle, rows_y);
        context.fillText(`${this.filled_rows}`, right_middle, rows_y + 45);
    }
}
//# sourceMappingURL=level.js.map