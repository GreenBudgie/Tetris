import Tetris from "../main/tetris.js";
import Field from "./field.js";
import { Figures } from "./figure.js";
export default class GameProcess {
    constructor(level) {
        this.points = 0;
        this.filledRows = 0;
        this.level = level;
        this.selectNextFigure();
        this.field = Field.defaultSizeField();
    }
    static initiate(level) {
        GameProcess.currentProcess = new GameProcess(level);
        return this.currentProcess;
    }
    static terminate() {
        GameProcess.currentProcess = null;
    }
    static getCurrentProcess() {
        return GameProcess.currentProcess;
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
        const fieldEndX = this.field.getRealFieldX() + this.field.getRealFieldWidth();
        return Math.round((fieldEndX + Tetris.instance.WINDOW_WIDTH) / 2);
    }
    getLeftSideMiddle() {
        return this.field.getRealFieldX() / 2;
    }
    drawNextFigurePreview(context) {
        context.font = "36px ft_default";
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
        context.font = "36px ft_default";
        context.fillStyle = "black";
        context.textBaseline = "top";
        context.textAlign = "center";
        const rightMiddle = this.getRightSideMiddle();
        const pointsY = this.field.getRealFieldY();
        context.fillText("- Points -", rightMiddle, pointsY);
        context.fillText(`${this.points} / ${this.level.requiredPoints}`, rightMiddle, pointsY + 45);
        const rowsY = pointsY + 150;
        context.fillText(`- Rows -`, rightMiddle, rowsY);
        context.fillText(`${this.filledRows}`, rightMiddle, rowsY + 45);
    }
}
GameProcess.currentProcess = null;
//# sourceMappingURL=gameProcess.js.map