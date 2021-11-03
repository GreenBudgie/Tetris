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

    private endX: number;
    private startX: number;
    private endY: number;
    private startY: number;
    private selectedX: number;
    private selectedY: number;

    private color: RGBColor;

    public currentColor: RGBColor;
    private readonly grayscale = RGBColor.grayscale(200);

    private readonly targetScale = 2;

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

    public isHoveredOrSelected(): boolean {
        return ArcadeHandler.getHandler().hoveredButtonIndex == this.index;
    }

    private fadeEffect: ColorFadeEffect;
    private moveEffect: MoveEffect;
    private scaleEffect: ScaleEffect;
    private readonly EFFECT_SPEED = 10;

    public playAppearEffect(): void {
        this.fadeEffect?.interruptNoCallback();
        this.moveEffect?.interruptNoCallback();

        this.currentColor.alpha = 0;
        this.x = this.startX;
        this.y = this.startY;
        this.fadeEffect = new ColorFadeEffect(this.currentColor, this.grayscale, this.EFFECT_SPEED);
        this.moveEffect = new MoveEffect(this, this.endX, this.endY, this.EFFECT_SPEED);
        this.moveEffect.pause(this.EFFECT_SPEED);
        this.moveEffect.easing = easeInOutQuad;
    }

    public playDisappearEffect(): void {
        this.fadeEffect?.interruptNoCallback();
        this.moveEffect?.interruptNoCallback();

        this.x = this.endX;
        this.y = this.endY;
        this.moveEffect = new MoveEffect(this, this.startX, this.startY, this.EFFECT_SPEED);
        this.moveEffect.easing = easeInOutQuad;
        const zeroAlpha = this.currentColor.clone();
        zeroAlpha.alpha = 0;
        this.fadeEffect = new ColorFadeEffect(this.currentColor, zeroAlpha, this.EFFECT_SPEED);
        this.fadeEffect.pause(this.EFFECT_SPEED);
        this.fadeEffect.callback = () => ArcadeHandler.getHandler().state = "hide";
    }

    public hideWhenAnotherSelected(): void {
        this.fadeEffect?.interruptNoCallback();
        const zeroAlpha = this.currentColor.clone();
        zeroAlpha.alpha = 0;
        this.fadeEffect = new ColorFadeEffect(this.currentColor, zeroAlpha, 10);
    }

    public showWhenAnotherDeselected(): void {
        this.fadeEffect?.interruptNoCallback();
        this.fadeEffect = new ColorFadeEffect(this.currentColor, this.grayscale, 10);
    }

    public onSelect(): void {
        this.moveEffect?.interruptNoCallback();
        this.scaleEffect?.interruptNoCallback();

        this.scaleEffect = new ScaleEffect(this, this.targetScale, 12);
        this.scaleEffect.easing = easeInQuad;

        this.moveEffect = new MoveEffect(this, this.selectedX, this.selectedY, 12);
        this.moveEffect.easing = easeOutQuad;

        this.blocks.forEach(block => block.onStageSelected());
    }

    public onDeselect(): void {
        this.moveEffect?.interruptNoCallback();
        this.scaleEffect?.interruptNoCallback();

        this.scaleEffect = new ScaleEffect(this, 1, 12);
        this.scaleEffect.easing = easeOutQuad;

        this.moveEffect = new MoveEffect(this, this.endX, this.endY, 12);
        this.moveEffect.easing = easeInQuad;

        this.blocks.forEach(block => block.onStageDeselected());
    }

    public onHover(): void {
        this.fadeEffect?.interruptWithCallback();
        this.fadeEffect = new ColorFadeEffect(this.currentColor, this.color, 8);
    }

    public onUnhover(): void {
        this.fadeEffect?.interruptWithCallback();
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

    public getRealXBySection(sectionX: number): number {
        return ArcadeHandler.getHandler().FIELD_START_X + sectionX * ArcadeHandler.getHandler().FIELD_SECTION_SIZE;
    }

    public getRealYBySection(sectionY: number): number {
        return ArcadeHandler.getHandler().FIELD_START_Y + sectionY * ArcadeHandler.getHandler().FIELD_SECTION_SIZE;
    }

    public setBlocks(blocks: StageBlock[]): void {
        this.blocks = blocks;
        let maxX = 0;
        let maxY = 0;
        for(const block of this.blocks) {
			if(block.x > maxX) maxX = block.x;
            if(block.y > maxY) maxY = block.y;
        }
        const handler = ArcadeHandler.getHandler();
        const scaledRealWidth = (maxX + 1) * this.targetScale * handler.FIELD_SECTION_SIZE;
        const scaledRealHeight = (maxY + 1) * this.targetScale * handler.FIELD_SECTION_SIZE;
        this.selectedX = handler.FIELD_START_X + (handler.REAL_FIELD_WIDTH / 2) - (scaledRealWidth / 2);
        this.selectedY = handler.FIELD_START_Y + (handler.REAL_FIELD_HEIGHT / 2) - (scaledRealHeight / 2);
    }

    public setColor(color: RGBColor): void {
        this.color = color.clone();
        this.currentColor = this.grayscale.clone();
    }

}