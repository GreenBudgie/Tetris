import Tetris from "../main/tetris.js";
import Point from "../util/point.js";
import Processable from "../util/processable.js";
import Field from "./field.js";
import Figure, {Figures} from "./figure.js";
import Level from "./level.js";

export default class GameProcess implements Processable {

    private static currentProcess: GameProcess | null = null;

    public readonly level: Level;
    public readonly field: Field;

    public points: number = 0;
    public filledRows: number = 0;
    public nextFigure: Figure;

    private _isPaused = false;

    public static initiate(level: Level): GameProcess {
        new GameProcess(level);
        return GameProcess.currentProcess;
    }

    public static terminate() {
        GameProcess.currentProcess = null;
    }

    public static getCurrentProcess(): GameProcess {
        return GameProcess.currentProcess;
    }

    private constructor(level: Level) {
        GameProcess.currentProcess = this;
        this.level = level;
        this.field = Field.defaultSizeField();
        this.selectNextFigure();
    }

    public pause() {
        this._isPaused = true;
    }

    public resume() {
        this._isPaused = false;
    }

    public get isPaused() {
        return this._isPaused;
    }

    public selectNextFigure() {
        this.nextFigure = Figures.createRandomFigure();
    }

    public createNextFigureAtField() {
        this.field.createFallingFigure(this.nextFigure);
    }

    public update(delta: number) {
        if(!this._isPaused) {
            this.field.update(delta);
        }
    }

    public draw(context: CanvasRenderingContext2D) {
        this.field.draw(context);
        this.drawPoints(context);
        this.drawNextFigurePreview(context);
    }

    public getRightSideMiddle() {
        const fieldEndX = this.field.getRealFieldPosition().x + this.field.getRealFieldWidth();
        return Math.round((fieldEndX + Tetris.instance.WINDOW_WIDTH) / 2);
    }

    public getLeftSideMiddle() {
        return this.field.getRealFieldPosition().x / 2;
    }

    public getPreviewCenterPosition() {
        return new Point(
            this.getLeftSideMiddle(),
            this.field.getRealFieldPosition().y + 80
        );
	}

    private drawNextFigurePreview(context: CanvasRenderingContext2D) {
        context.font = "36px ft_default";
        context.fillStyle = "black";
        context.textBaseline = "top";
        context.textAlign = "center";
        
        const leftMiddle = this.getLeftSideMiddle();

        context.fillText("- Next -", leftMiddle, this.field.getRealFieldPosition().y);

        if(this.nextFigure != null) {
            this.nextFigure.drawPreview(context);
        }
    }

    private drawPoints(context: CanvasRenderingContext2D) {
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