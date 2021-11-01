import Colorizable from "../../color/colorizable.js";
import RGBColor from "../../color/rgbColor.js";
import Positionable from "../../util/positionable.js";
import Processable from "../../util/processable.js";
import ArcadeHandler from "./arcadeHandler.js";
import StageBlock from "./stageBlock.js";


export default class StageButton implements Processable, Colorizable, Positionable {

    private _x: number;
    private _y: number;
    private blocks: StageBlock[];

    private sectionX: number;
    private centerSectionX: number;
    private sectionY: number;
    private centerSectionY: number;

    private color: RGBColor;

    public constructor() {
        
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

    public getColor(): RGBColor {
        return this.color;
    }

    public update(delta: number): void {
    }

    public draw(context: CanvasRenderingContext2D): void {
        for(const block of this.blocks) {
            block.draw(context);
        }
    }

    public setSection(sectionX: number, sectionY: number): void {
        this.sectionX = sectionX;
        this.sectionY = sectionY;
    }

    public setCenterSection(centerSectionX: number, centerSectionY: number): void {
        this.x = this.getRealXBySection(centerSectionX);
        this.y = this.getRealYBySection(centerSectionY);
        this.centerSectionX = centerSectionX;
        this.centerSectionY = centerSectionY;
    }

    public getRealXBySection(sectionX: number): number {
        return ArcadeHandler.getHandler().FIELD_START_X + sectionX * ArcadeHandler.getHandler().FIELD_SECTION_SIZE;
    }

    public getRealYBySection(sectionY: number): number {
        return ArcadeHandler.getHandler().FIELD_START_Y + sectionY * ArcadeHandler.getHandler().FIELD_SECTION_SIZE;
    }

    public setBlocks(blocks: StageBlock[]): void {
        this.blocks = blocks;
    }

    public setColor(color: RGBColor): void {
        this.color = color;
    }

}