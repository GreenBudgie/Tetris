import ColorFadeEffect from "../../color/colorFadeEffect.js";
import Colorizable from "../../color/colorizable.js";
import RGBColor from "../../color/rgbColor.js";
import {easeInOutQuad, easeInQuad, easeOutQuad} from "../../effect/effectEasings.js";
import MoveEffect from "../../effect/moveEffect.js";
import ScaleEffect from "../../effect/scaleEffect.js";
import Positionable from "../../util/positionable.js";
import Processable from "../../util/processable.js";
import Scalable from "../../util/scalable.js";
import ArcadeHandler from "./arcadeHandler.js";
import StageBlock from "./stageBlock.js";


export default class StageButton implements Processable, Colorizable, Positionable, Scalable {

    public readonly index: number;

    private _x: number;
    private _y: number;
    private _scale: number = 1;
    private blocks: StageBlock[];
    private width: number;
    private height: number;

    private endX: number;
    private startX: number;
    private endY: number;
    private startY: number;

    private color: RGBColor;

    public currentColor: RGBColor;
    private readonly grayscale = RGBColor.grayscale(200);

    public constructor(index: number) {
        this.index = index;
    }

    public get scale(): number {
        return this._scale;
    }

    public set scale(scale: number) {
        this._scale = scale;
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

    public isHovered(): boolean {
        return ArcadeHandler.getHandler().hoveredButtonIndex == this.index;
    }

    public isSelected(): boolean {
        return ArcadeHandler.getHandler().selectedButton == this;
    }

    private fadeEffect: ColorFadeEffect;
    private moveEffect: MoveEffect;
    private readonly EFFECT_SPEED = 10;

    public playAppearEffect(): void {
        this.fadeEffect?.interrupt();
        this.moveEffect?.interrupt();

        ArcadeHandler.getHandler().needsToDraw = true;

        this.currentColor.alpha = 0;
        this.x = this.startX;
        this.y = this.startY;
        this.fadeEffect = new ColorFadeEffect(this.currentColor, this.grayscale, this.EFFECT_SPEED);
        this.moveEffect = new MoveEffect(this, this.endX, this.endY, this.EFFECT_SPEED);
        this.moveEffect.pause(this.EFFECT_SPEED);
        this.moveEffect.easing = easeInOutQuad;
    }

    public playDisappearEffect(): void {
        this.fadeEffect?.interrupt();
        this.moveEffect?.interrupt();

        this.x = this.endX;
        this.y = this.endY;
        this.moveEffect = new MoveEffect(this, this.startX, this.startY, this.EFFECT_SPEED);
        this.moveEffect.easing = easeInOutQuad;
        const zeroAlpha = this.currentColor.clone();
        zeroAlpha.alpha = 0;
        this.fadeEffect = new ColorFadeEffect(this.currentColor, zeroAlpha, this.EFFECT_SPEED);
        this.fadeEffect.pause(this.EFFECT_SPEED);
        this.fadeEffect.callback = () => ArcadeHandler.getHandler().needsToDraw = false;
    }

    public select(): void {

    }

    public deselect(): void {

    }

    public hover(): void {
        this.fadeEffect?.interrupt();
        this.fadeEffect = new ColorFadeEffect(this.currentColor, this.color, 8);
    }

    public unhover(): void {
        this.fadeEffect?.interrupt();
        this.fadeEffect = new ColorFadeEffect(this.currentColor, this.grayscale, 8);
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

    public getCurrentBlockSize(): number {
        return this.scale * ArcadeHandler.getHandler().FIELD_SECTION_SIZE;
    }

    public getRealXBySection(sectionX: number): number {
        return ArcadeHandler.getHandler().FIELD_START_X + sectionX * this.getCurrentBlockSize();
    }

    public getRealYBySection(sectionY: number): number {
        return ArcadeHandler.getHandler().FIELD_START_Y + sectionY * this.getCurrentBlockSize();
    }

    public setBlocks(blocks: StageBlock[]): void {
        this.blocks = blocks;
        let maxX = 0;
        let maxY = 0;
        for(const block of this.blocks) {
			if(block.x > maxX) maxX = block.x;
            if(block.y > maxY) maxY = block.y;
        }
        this.width = maxX + 1;
        this.height = maxY + 1;
    }

    public setColor(color: RGBColor): void {
        this.color = color.clone();
        this.currentColor = this.grayscale.clone();
    }

}