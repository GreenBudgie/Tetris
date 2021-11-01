import ColorFadeEffect from "../../color/colorFadeEffect.js";
import Colorizable from "../../color/colorizable.js";
import RGBColor from "../../color/rgbColor.js";
import {easeInQuad, easeOutQuad} from "../../effect/effectEasings.js";
import MoveEffect from "../../effect/moveEffect.js";
import Positionable from "../../util/positionable.js";
import Processable from "../../util/processable.js";
import ArcadeHandler from "./arcadeHandler.js";
import StageBlock from "./stageBlock.js";


export default class StageButton implements Processable, Colorizable, Positionable {

    private _x: number;
    private _y: number;
    private blocks: StageBlock[];

    private endX: number;
    private startX: number;
    private endY: number;
    private startY: number;

    private color: RGBColor;

    public currentColor: RGBColor;

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
        return this.currentColor;
    }

    public playEffect(): void {
        this.currentColor.alpha = 0;
        this.x = this.startX;
        this.y = this.startY;
        const fade = new ColorFadeEffect(this.currentColor, this.color, 12);
        const move = new MoveEffect(this, this.endX, this.endY, 12);
        move.pause(12);
        move.easing = easeOutQuad;
    }

    public update(delta: number): void {
    }

    public draw(context: CanvasRenderingContext2D): void {
        for(const block of this.blocks) {
            block.draw(context);
        }
    }

    public setEndSection(sectionX: number, sectionY: number): void {
        this.endX = this.getRealXBySection(sectionX);
        this.endY = this.getRealYBySection(sectionY);
    }

    public setStartSection(sectionX: number, sectionY: number): void {
        this.startX = this.getRealXBySection(sectionX);
        this.startY = this.getRealYBySection(sectionY);
        this.x = this.startX;
        this.y = this.startY;
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
        this.currentColor = color.clone();
    }

}