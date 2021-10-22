import Field from "../game/field.js";
import Figure, {Figures} from "../game/figure.js";
import Tetris from "../game/tetris.js";

export default class Level {

    public field: Field;
    public filled_rows: number = 0;
    public points: number = 0;
    public required_points: number;

    public nextFigure: Figure;

    public constructor() {
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

    public draw() {
        this.field.draw();
        this.drawPoints();
        this.drawNextFigurePreview();
    }

    public getRightSideMiddle() {
        const field_end_x = this.field.getRealFieldX() + this.field.getRealFieldWidth();
        return Math.round((field_end_x + Tetris.instance.window_width) / 2);
    }

    public getLeftSideMiddle() {
        return this.field.getRealFieldX() / 2;
    }

    private drawNextFigurePreview() {
        const context = Tetris.instance.context;
        context.font = "36px homespun";
        context.fillStyle = "black";
        context.textBaseline = "top";
        context.textAlign = "center";
        
        const leftMiddle = this.getLeftSideMiddle();

        context.fillText("- Next -", leftMiddle, this.field.getRealFieldY());

        if(this.nextFigure != null) {
            this.nextFigure.drawAsPreview();
        }
    }

    private drawPoints() {
        const context = Tetris.instance.context;
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