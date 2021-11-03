import Colorizable from "../../color/colorizable.js";
import RGBColor from "../../color/rgbColor.js";
import Level from "../../level/level.js";
import State from "../../state/state.js";
import Positionable from "../../util/positionable.js";
import Processable from "../../util/processable.js";
import ArcadeHandler from "./arcadeHandler.js";
import StageButton from "./stageButton.js";

export default class StageBlock implements Processable, Colorizable, Positionable {

    private _x: number;
    private _y: number;
    private level: Level;
    private stageButton: StageButton;

    private isSelected = false;

    public constructor(relativeX: number, relativeY: number, level: Level, stageButton: StageButton) {
        this.x = relativeX;
        this.y = relativeY;
        this.level = level;
        this.stageButton = stageButton;
    }

    public get x(): number {
        return this._x;
    }

    public set x(x: number) {
        this._x = x;
    }

    public get y(): number {
        return this._y;
    }

    public set y(y: number) {
        this._y = y;
    }

    public select(): void {

    }

    public deselect(): void {

    }

    public update(delta: number): void {
        
    }

    private getBlockSize(): number {
        return ArcadeHandler.getHandler().FIELD_SECTION_SIZE * this.stageButton.scale;
    }

    private getRealStartX(): number {
        return this.stageButton.x + this.x * this.getBlockSize();
    }

    private getRealStartY(): number {
        return this.stageButton.y + this.y * this.getBlockSize();
    }

    private getRealTextCenterX(): number {
        return this.getRealStartX() + this.getBlockSize() / 2
    }

    private getRealTextCenterY(): number {
        return this.getRealStartY() + this.getBlockSize() / 2
    }

    private getScaledFontSize(): number {
        return 40 * this.stageButton.scale;
    }

    public draw(context: CanvasRenderingContext2D): void {
        const blockSize = this.getBlockSize();
        const startX = this.getRealStartX();
        const startY = this.getRealStartY();

        context.fillStyle = this.getColor().rgbString;
        context.strokeStyle = `rgba(0, 0, 0, ${this.getColor().alpha})`;
        context.lineWidth = 2 * this.stageButton.scale;

        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(startX + blockSize, startY);
        context.lineTo(startX + blockSize, startY + blockSize);
        context.lineTo(startX, startY + blockSize);
        context.lineTo(startX, startY);
        context.fill();
        context.stroke();

        if(ArcadeHandler.getHandler().state == "levelSelect" && this.stageButton.isHoveredOrSelected()) {
            this.drawLevelNumber(context);
        }
    }

    private drawLevelNumber(context: CanvasRenderingContext2D): void {
        context.font = `${this.getScaledFontSize()}px ft_default`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.lineWidth = 2;
        context.strokeStyle = `rgba(0, 0, 0, ${this.stageButton.getColor().alpha})`;
        context.fillStyle = `rgba(255, 255, 255, ${this.stageButton.getColor().alpha})`;

        const centerX = this.getRealTextCenterX();
        const centerY = this.getRealTextCenterY();

        context.fillText(this.level.levelNumber.toString(), centerX, centerY);
        context.strokeText(this.level.levelNumber.toString(), centerX, centerY);
    }

    public getColor(): RGBColor {
        return this.stageButton.getColor();
    }

}