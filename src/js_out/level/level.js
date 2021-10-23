import { Figures } from "../game/figure.js";
import Tetris from "../game/tetris.js";
export default class Level {
    constructor() {
        this.filled_rows = 0;
        this.points = 0;
        this.selectNextFigure();
    }
    selectNextFigure() {
        this.nextFigure = Figures.createRandomFigure();
    }
    createNextFigureAtField() {
        this.field.createFallingFigure(this.nextFigure);
    }
    update(delta) {
        this.field.update(delta);
    }
    draw(context) {
        this.field.draw(context);
        this.drawPoints(context);
        this.drawNextFigurePreview(context);
    }
    getRightSideMiddle() {
        const field_end_x = this.field.getRealFieldX() + this.field.getRealFieldWidth();
        return Math.round((field_end_x + Tetris.instance.window_width) / 2);
    }
    getLeftSideMiddle() {
        return this.field.getRealFieldX() / 2;
    }
    drawNextFigurePreview(context) {
        context.font = "36px homespun";
        context.fillStyle = "black";
        context.textBaseline = "top";
        context.textAlign = "center";
        const leftMiddle = this.getLeftSideMiddle();
        context.fillText("- Next -", leftMiddle, this.field.getRealFieldY());
        if (this.nextFigure != null) {
            this.nextFigure.drawAsPreview(context);
        }
    }
    drawPoints(context) {
        context.font = "36px homespun";
        context.fillStyle = "black";
        context.textBaseline = "top";
        context.textAlign = "center";
        const rightMiddle = this.getRightSideMiddle();
        const pointsY = this.field.getRealFieldY();
        context.fillText("- Points -", rightMiddle, pointsY);
        context.fillText(`${this.points} / ${this.required_points}`, rightMiddle, pointsY + 45);
        const rowsY = pointsY + 150;
        context.fillText(`- Rows -`, rightMiddle, rowsY);
        context.fillText(`${this.filled_rows}`, rightMiddle, rowsY + 45);
    }
}
//# sourceMappingURL=level.js.map