import Colorizable, {Color} from "../game/color.js";
import Tetris from "../game/tetris.js";
import Processable from "../util/processable.js";
import Menu from "./menu.js";

export default abstract class MenuButton implements Colorizable, Processable {

    public readonly index: number;
    public readonly blockSize = 85;
    public readonly shape = this.getShape();
    public readonly shapeWidth = this.getShapeWidth(); 
    public readonly shapeHeight = this.getShapeHeight(); 

    public readonly x: number = Tetris.instance.WINDOW_WIDTH / 2 - this.blockSize * this.shapeWidth / 2;
    public readonly textCenterX: number = this.x + this.getTextCenterPosition().x * this.blockSize;
    public readonly startY: number = Tetris.instance.WINDOW_HEIGHT / 2 - this.blockSize * this.shapeHeight / 2;

    private _y: number;
    private textCenterY: number; 

    public constructor(index: number) {
        this.index = index;
        this.y = this.getYForIndex(0);
    }

    public abstract getColor(): Color;
    public abstract onClick(): void;
    public abstract getText(): string;
    public abstract getShape(): ButtonShape;
    public abstract getTextCenterPosition(): {x: number, y: number};

    public get y(): number {
        return this._y;
    }

    public set y(y: number) {
        this._y = this.startY + y;
        this.textCenterY = this.y + this.getTextCenterPosition().y * this.blockSize;
    }

    public getYForIndex(index: number): number {
        const indexShift = index - this.index;
        let shiftedY = indexShift * this.blockSize * 1.5;
        if(indexShift < 0) return shiftedY + indexShift * this.blockSize * 1.5;
        return shiftedY;
    }

    public getShapeWidth(): number {
        let maxX = 0;
        for(const blockPos of this.shape) {
            if(blockPos.x > maxX) maxX = blockPos.x;
        }
        return maxX + 1;
    }

    public getShapeHeight(): number {
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
        context.fillText(this.getText(), this.textCenterX, this.textCenterY);
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.strokeText(this.getText(), this.textCenterX, this.textCenterY);
    }

    private drawFigure(context: CanvasRenderingContext2D): void {
        context.strokeStyle = "black";
        context.lineWidth = 4;
        context.lineCap = "square";
        context.fillStyle = this.getColor();
        
        for(const blockPos of this.shape) {
            const currentStartX = this.x + blockPos.x * this.blockSize;
            const currentStartY = this.y + blockPos.y * this.blockSize;
            context.beginPath();
            context.moveTo(currentStartX - 1, currentStartY - 1);
            context.lineTo(currentStartX + this.blockSize + 1, currentStartY - 1);
            context.lineTo(currentStartX + this.blockSize + 1, currentStartY + this.blockSize + 1);
            context.lineTo(currentStartX - 1, currentStartY + this.blockSize + 1);
            context.lineTo(currentStartX - 1, currentStartY - 1);
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