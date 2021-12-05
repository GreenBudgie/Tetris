import Colorizable from "../color/colorizable.js";
import RGBColor from "../color/rgbColor.js";
import Tetris from "../main/tetris.js";
import SpriteFigure from "../sprite/spriteFigure.js";
import Processable from "../util/processable.js";
import Menu from "./menu.js";

export default abstract class MenuButton implements Colorizable, Processable {

    public readonly sprite: SpriteFigure;

    public readonly index: number;

    public readonly textCenterX: number;
    public readonly textCenterY: number;

    public readonly grayColor = RGBColor.grayscale(200);

    public constructor(index: number) {
        this.index = index;

        this.sprite = new SpriteFigure(this.getShape());
        this.sprite.blockSize = 85;
        this.sprite.setOutlineWidthBasedOnBlockSize();

        const startY: number = Tetris.instance.WINDOW_HEIGHT / 2 - this.sprite.getRealHeight() / 2;

        this.sprite.x = this.sprite.blockSize;
        this.sprite.y = startY + (index - 1) * this.sprite.blockSize * 1.5;
        this.sprite.getColor().setTo(index == 0 ? this.getColor() : this.grayColor);

        this.textCenterX = this.sprite.x + this.getTextCenterPosition().x * this.sprite.blockSize;
        this.textCenterY = this.sprite.y + this.getTextCenterPosition().y * this.sprite.blockSize;
    }

    public abstract getColor(): RGBColor;
    public abstract onClick(): void;
    public abstract getText(): string;
    public abstract getShape(): [number, number][];
    public abstract getTextCenterPosition(): {x: number, y: number};
    public abstract getTextSize(): number;

    public isCurrent(): boolean {
        return Menu.getMenu().currentButton == this;
    }

    public onSelect(): void {
    }

    public onDeselect(): void {
        
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
        context.font = this.getTextSize() + "px ft_default";
        context.fillText(this.getText(), this.textCenterX, this.textCenterY);
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.strokeText(this.getText(), this.textCenterX, this.textCenterY);
    }

    private drawFigure(context: CanvasRenderingContext2D): void {
        this.sprite.draw(context);
    }

}