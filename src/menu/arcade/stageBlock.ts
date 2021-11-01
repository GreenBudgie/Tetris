import Colorizable from "../../color/colorizable.js";
import RGBColor from "../../color/rgbColor.js";
import Level from "../../level/level.js";
import Positionable from "../../util/positionable.js";
import Processable from "../../util/processable.js";
import ArcadeHandler from "./arcadeHandler.js";
import StageButton from "./stageButton.js";

export default class StageBlock implements Processable, Colorizable, Positionable {

    private _x: number;
    private _y: number;
    private level: Level;
    private stageButton: StageButton;

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

    public update(delta: number): void {
        
    }

    public draw(context: CanvasRenderingContext2D): void {
        const sectionSize = ArcadeHandler.getHandler().FIELD_SECTION_SIZE;
        const startX = this.stageButton.x + this.x * sectionSize;
        const startY = this.stageButton.y + this.y * sectionSize;

        context.fillStyle = this.getColor().rgbString;
        context.strokeStyle = "black";
        context.lineWidth = 2;

        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(startX + sectionSize, startY);
        context.lineTo(startX + sectionSize, startY + sectionSize);
        context.lineTo(startX, startY + sectionSize);
        context.lineTo(startX, startY);
        context.fill();
        context.stroke();
    }

    public getColor(): RGBColor {
        return this.stageButton.getColor();
    }

}