import Tetris from "../main/tetris.js";
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

    public static initiate(level: Level): GameProcess {
        GameProcess.currentProcess = new GameProcess(level);
        return this.currentProcess;
    }

    public static terminate() {
        GameProcess.currentProcess = null;
    }

    public static getCurrentProcess(): GameProcess {
        return GameProcess.currentProcess;
    }

    private constructor(level: Level) {
        this.level = level;
        this.selectNextFigure();
        this.field = Field.defaultSizeField();
    }

    public selectNextFigure() {
        this.nextFigure = Figures.createRandomFigure();
    }

    public createNextFigureAtField() {
        this.field.createFallingFigure(this.nextFigure);
    }

    public update(delta: number) {
        this.field.update(delta);
    }

    public draw(context: CanvasRenderingContext2D) {
        this.field.draw(context);
        this.drawPoints(context);
        this.drawNextFigurePreview(context);
    }

    public getRightSideMiddle() {
        const fieldEndX = this.field.getRealFieldX() + this.field.getRealFieldWidth();
        return Math.round((fieldEndX + Tetris.instance.WINDOW_WIDTH) / 2);
    }

    public getLeftSideMiddle() {
        return this.field.getRealFieldX() / 2;
    }

    private drawNextFigurePreview(context: CanvasRenderingContext2D) {
        context.font = "36px ft_default";
        context.fillStyle = "black";
        context.textBaseline = "top";
        context.textAlign = "center";
        
        const leftMiddle = this.getLeftSideMiddle();

        context.fillText("- Next -", leftMiddle, this.field.getRealFieldY());

        if(this.nextFigure != null) {
            this.nextFigure.drawAsPreview(context);
        }
    }

    private drawPoints(context: CanvasRenderingContext2D) {
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