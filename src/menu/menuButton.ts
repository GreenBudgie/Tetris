import Colorizable, {Color} from "../game/color.js";
import Tetris from "../game/tetris.js";
import Processable from "../util/processable.js";
import Menu from "./menu.js";

export default abstract class MenuButton implements Colorizable, Processable {

    public readonly index: number;
    public readonly blockSize = 100;
    public readonly shape = this.getShape();
    public readonly shapeWidth = this.getShapeWidth(); 
    public readonly shapeHeight = this.getShapeHeight(); 

    public constructor(index: number) {
        this.index = index;
    }

    public abstract getColor(): Color;
    public abstract onClick(): void;
    public abstract getText(): string;
    public abstract getShape(): ButtonShape;
    public abstract getTextCenterPosition(): {x: number, y: number};

    protected getFigureShiftY(): number {
        const currentIndex = Menu.getMenu().currentButtonIndex;
        const indexShift = this.index - currentIndex;
        if(indexShift > 0) return -indexShift * this.blockSize * 2.75;
        if(indexShift < 0) return indexShift * this.blockSize;
        return 0;
    }

    protected getFigureStartX(): number {
        return Tetris.instance.WINDOW_WIDTH / 2 - this.blockSize * this.shapeWidth / 2;
    }

    protected getFigureStartY(): number {
        const startY = Tetris.instance.WINDOW_HEIGHT / 2 - this.blockSize * this.shapeHeight / 2;
        return startY + this.getFigureShiftY();
    }

    protected getTextCenterX(): number {
        return this.getFigureStartX() + this.getTextCenterPosition().x * this.blockSize;
    }

    protected getTextCenterY(): number {
        return this.getFigureStartY() + this.getTextCenterPosition().y * this.blockSize;
    }

    private getShapeWidth(): number {
        let maxX = 0;
        for(const blockPos of this.shape) {
            if(blockPos.x > maxX) maxX = blockPos.x;
        }
        return maxX + 1;
    }

    private getShapeHeight(): number {
        let maxY = 0;
        for(const blockPos of this.shape) {
            if(blockPos.y > maxY) maxY = blockPos.y;
        }
        return maxY + 1;
    }

    public isCurrent(): boolean {
        return Menu.getMenu().currentButton == this;
    }

    public click(): void {
        this.onClick();
    }

    public update(delta: number): void {

    }

    public draw(context: CanvasRenderingContext2D): void {
        this.drawFigure(context);
        this.drawText(context);
    }

    private drawText(context: CanvasRenderingContext2D): void {
        context.fillStyle = "white";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "64px ft_default";
        context.fillText(this.getText(), this.getTextCenterX(), this.getTextCenterY());
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.strokeText(this.getText(), this.getTextCenterX(), this.getTextCenterY());
    }

    private drawFigure(context: CanvasRenderingContext2D): void {
        context.strokeStyle = "black";
        context.lineWidth = 4;
        context.lineCap = "square";
        context.fillStyle = this.getColor();
        
        for(const blockPos of this.shape) {
            const currentStartX = this.getFigureStartX() + blockPos.x * this.blockSize;
            const currentStartY = this.getFigureStartY() + blockPos.y * this.blockSize;
            context.beginPath();
            context.moveTo(currentStartX, currentStartY);
            context.lineTo(currentStartX + this.blockSize, currentStartY);
            context.lineTo(currentStartX + this.blockSize, currentStartY + this.blockSize);
            context.lineTo(currentStartX, currentStartY + this.blockSize);
            context.lineTo(currentStartX, currentStartY);
            context.fill();

            context.beginPath();
            context.moveTo(currentStartX, currentStartY);

            if(this.isFree(blockPos, 0, -1)) {
                context.lineTo(currentStartX + this.blockSize, currentStartY);
            } else {
                context.moveTo(currentStartX + this.blockSize, currentStartY);
            }

            if(this.isFree(blockPos, 1, 0)) {
                context.lineTo(currentStartX + this.blockSize, currentStartY + this.blockSize);
            } else {
                context.moveTo(currentStartX + this.blockSize, currentStartY + this.blockSize);
            }

            if(this.isFree(blockPos, 0, 1)) {
                context.lineTo(currentStartX, currentStartY + this.blockSize);
            } else {
                context.moveTo(currentStartX, currentStartY + this.blockSize);
            }

            if(this.isFree(blockPos, -1, 0)) {
                context.lineTo(currentStartX, currentStartY);
            }

            context.stroke();
        }
    }

    private isFree(blockPos: {x: number, y: number}, dx: number, dy: number) {
        return !this.shape.some(pos => pos.x == blockPos.x + dx && pos.y == blockPos.y + dy);
    }

}

export type ButtonShape = {x: number, y: number}[];