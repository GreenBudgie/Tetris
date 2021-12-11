import Tetris from "../main/tetris.js";
import Point from "../util/point.js";
import Field from "./field.js";
import { Figures } from "./figure.js";
export default class GameProcess {
    constructor(level) {
        this.points = 0;
        this.filledRows = 0;
        this._isPaused = false;
        GameProcess.currentProcess = this;
        this.level = level;
        this.field = Field.defaultSizeField();
        this.selectNextFigure();
    }
    static initiate(level) {
        new GameProcess(level);
        return GameProcess.currentProcess;
    }
    static terminate() {
        GameProcess.currentProcess = null;
    }
    static getCurrentProcess() {
        return GameProcess.currentProcess;
    }
    pause() {
        this._isPaused = true;
    }
    resume() {
        this._isPaused = false;
    }
    get isPaused() {
        return this._isPaused;
    }
    selectNextFigure() {
        this.nextFigure = Figures.createRandomFigure();
    }
    createNextFigureAtField() {
        this.field.createFallingFigure(this.nextFigure);
    }
    update(delta) {
        if (!this._isPaused) {
            this.field.update(delta);
        }
    }
    draw(context) {
        this.field.draw(context);
        this.drawPoints(context);
        this.drawNextFigurePreview(context);
    }
    getRightSideMiddle() {
        const fieldEndX = this.field.getRealFieldPosition().x + this.field.getRealFieldWidth();
        return Math.round((fieldEndX + Tetris.instance.WINDOW_WIDTH) / 2);
    }
    getLeftSideMiddle() {
        return this.field.getRealFieldPosition().x / 2;
    }
    getPreviewCenterPosition() {
        return new Point(this.getLeftSideMiddle(), this.field.getRealFieldPosition().y + 60);
    }
    drawNextFigurePreview(context) {
        context.font = "36px ft_default";
        context.fillStyle = "black";
        context.textBaseline = "top";
        context.textAlign = "center";
        const leftMiddle = this.getLeftSideMiddle();
        context.fillText("- Next -", leftMiddle, this.field.getRealFieldPosition().y);
        if (this.nextFigure != null) {
            this.nextFigure.drawPreview(context);
        }
    }
    drawPoints(context) {
        context.font = "36px ft_default";
        context.fillStyle = "black";
        context.textBaseline = "top";
        context.textAlign = "center";
        const rightMiddle = this.getRightSideMiddle();
        const pointsY = this.field.getRealFieldPosition().y;
        context.fillText("- Points -", rightMiddle, pointsY);
        context.fillText(`${this.points} / ${this.level.requiredPoints}`, rightMiddle, pointsY + 45);
        const rowsY = pointsY + 150;
        context.fillText(`- Rows -`, rightMiddle, rowsY);
        context.fillText(`${this.filledRows}`, rightMiddle, rowsY + 45);
    }
}
GameProcess.currentProcess = null;
//# sourceMappingURL=gameProcess.js.map