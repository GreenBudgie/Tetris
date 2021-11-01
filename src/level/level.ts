import Field from "../game/field.js";
import Figure, {Figures} from "../game/figure.js";
import Tetris from "../game/tetris.js";
import Processable from "../util/processable.js";

export default class Level implements Processable {

    public levelNumber: number;

    public field: Field;
    public filled_rows: number = 0;
    public points: number = 0;
    public requiredPoints: number;

    public nextFigure: Figure;

    public constructor(levelNumber: number) {
        this.levelNumber = levelNumber;
        this.selectNextFigure();
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
        context.fillText(`${this.points} / ${this.requiredPoints}`, rightMiddle, pointsY + 45);

        const rowsY = pointsY + 150;

        context.fillText(`- Rows -`, rightMiddle, rowsY);
        context.fillText(`${this.filled_rows}`, rightMiddle, rowsY + 45);
    }

}