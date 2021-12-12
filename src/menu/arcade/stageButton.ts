import ColorFadeEffect from "../../color/colorFadeEffect.js";
import Colorizable from "../../color/colorizable.js";
import RGBColor from "../../color/rgbColor.js";
import {easeInOutQuad, easeInQuad, easeOutQuad} from "../../effect/effectEasings.js";
import MoveEffect from "../../effect/moveEffect.js";
import Transition from "../../effect/transition.js";
import InputHandler, {KeyBindings} from "../../main/inputHandler.js";
import Point, {Positionable} from "../../util/point.js";
import Processable from "../../util/processable.js";
import ArcadeHandler from "./arcadeHandler.js";
import StageBlock from "./stageBlock.js";


export default class StageButton implements Processable, Colorizable, Positionable {

    public readonly index: number;

    private _position: Point;
    private _scale: number = 1;
    private blocks: StageBlock[];

    private startPos: Point = Point.zero();
    private endPos: Point;
    private selectedPos: Point;

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

    public get position(): Point {
        return this._position;
    }

    public getColor(): RGBColor {
        return this.currentColor;
    }

    public isHoveredOrSelected(): boolean {
        return ArcadeHandler.getHandler().hoveredButtonIndex == this.index;
    }

    private fadeEffect: ColorFadeEffect;
    private moveEffect: MoveEffect;
    private scaleTransition: Transition;
    private readonly EFFECT_SPEED = 10;

    public playAppearEffect(): void {
        this.fadeEffect?.interrupt();
        this.moveEffect?.interrupt();

        this.fadeEffect = new ColorFadeEffect(this.currentColor, this.grayscale, this.EFFECT_SPEED);
        this.moveEffect = new MoveEffect(this, this.endPos, this.EFFECT_SPEED);
        this.moveEffect.pause(this.EFFECT_SPEED);
        this.moveEffect.easing = easeInOutQuad;
    }

    public playDisappearEffect(): void {
        this.fadeEffect?.interrupt();
        this.moveEffect?.interrupt();

        this.moveEffect = new MoveEffect(this, this.startPos, this.EFFECT_SPEED);
        this.moveEffect.easing = easeInOutQuad;
        const zeroAlpha = this.currentColor.clone();
        zeroAlpha.alpha = 0;
        this.fadeEffect = new ColorFadeEffect(this.currentColor, zeroAlpha, this.EFFECT_SPEED);
        this.fadeEffect.pause(this.EFFECT_SPEED);
        this.fadeEffect.callback = () => ArcadeHandler.getHandler().state = "hide";
    }

    public hideWhenAnotherSelected(): void {
        this.fadeEffect?.interrupt();
        const zeroAlpha = this.currentColor.clone();
        zeroAlpha.alpha = 0;
        this.fadeEffect = new ColorFadeEffect(this.currentColor, zeroAlpha, 10);
    }

    public showWhenAnotherDeselected(): void {
        this.fadeEffect?.interrupt();
        this.fadeEffect = new ColorFadeEffect(this.currentColor, this.grayscale, 10);
    }

    public onSelect(): void {
        this.moveEffect?.interrupt();
        this.scaleTransition?.interrupt();

        this.scaleTransition = new Transition(value => {this.scale = value}, this.scale, this.targetScale, 12);
        this.scaleTransition.easing = easeInQuad;

        this.moveEffect = new MoveEffect(this, this.selectedPos, 12);
        this.moveEffect.easing = easeOutQuad;

        this.blocks.forEach(block => block.onStageSelected());
        this.blocks[0].select();
    }

    public onDeselect(): void {
        this.moveEffect?.interrupt();
        this.scaleTransition?.interrupt();

        this.scaleTransition = new Transition(value => {this.scale = value}, this.scale, 1, 12);
        this.scaleTransition.easing = easeOutQuad;

        this.moveEffect = new MoveEffect(this, this.endPos, 12);
        this.moveEffect.easing = easeInQuad;

        this.blocks.forEach(block => block.onStageDeselected());
    }

    public onHover(): void {
        this.fadeEffect?.interrupt();
        this.fadeEffect = new ColorFadeEffect(this.currentColor, this.color, 8);
    }

    public onUnhover(): void {
        this.fadeEffect?.interrupt();
        this.fadeEffect = new ColorFadeEffect(this.currentColor, this.grayscale, 8);
    }

    public update(delta: number): void {
        if(ArcadeHandler.getHandler().state == "levelSelect") {
            this.handleSelectionMovement();
        }
        this.blocks.forEach(block => block.update(delta));
    }

    private handleSelectionMovement(): void {
        let blockDeltaX = 0;
        let blockDeltaY = 0;
        const input = InputHandler.getHandler();
        if(input.isKeyBindingPressed(KeyBindings.MENU_UP)) {
            blockDeltaY = -1;
        } else if(input.isKeyBindingPressed(KeyBindings.MENU_RIGHT)) {
            blockDeltaX = 1;
        } else if(input.isKeyBindingPressed(KeyBindings.MENU_DOWN)) {
            blockDeltaY = 1;
        } else if(input.isKeyBindingPressed(KeyBindings.MENU_LEFT)) {
            blockDeltaX = -1;
        }
        if(blockDeltaX != 0 || blockDeltaY != 0) {
            const selectedBlock = this.getSelectedBlock();
            if(selectedBlock != undefined) {
                const nextBlock = this.getBlockByPos(selectedBlock.position.x + blockDeltaX, selectedBlock.position.y + blockDeltaY);
                if(nextBlock != undefined) {
                    selectedBlock.deselect();
                    nextBlock.select();
                } else {
                    ArcadeHandler.getHandler().stopLevelSelect();
                }
            }
        }
    }

    private getSelectedBlock(): StageBlock | undefined {
        return this.blocks.find(block => block.isSelected);
    }

    private getBlockByPos(relativeX: number, relativeY: number): StageBlock | undefined {
        return this.blocks.find(block => block.position.x == relativeX && block.position.y == relativeY);
    }

    public draw(context: CanvasRenderingContext2D): void {
        this.blocks.forEach(block => block.draw(context));
    }

    public setEndSection(sectionPosition: Point): void {
        this.endPos = this.getRealPositionBySection(sectionPosition);
    }

    public setStartSection(sectionPosition: Point): void {
        this.startPos = this.getRealPositionBySection(sectionPosition);
        this._position = this.startPos.clone();
    }

    public getRealPositionBySection(sectionPosition: Point): Point {
        const handler = ArcadeHandler.getHandler();
        return new Point(
            handler.FIELD_START_POSITION.x + sectionPosition.x * handler.FIELD_SECTION_SIZE,
            handler.FIELD_START_POSITION.y + sectionPosition.y * handler.FIELD_SECTION_SIZE
        );
    }

    public setBlocks(blocks: StageBlock[]): void {
        this.blocks = blocks;
        let maxX = 0;
        let maxY = 0;
        for(const block of this.blocks) {
			if(block.position.x > maxX) maxX = block.position.x;
            if(block.position.y > maxY) maxY = block.position.y;
        }
        const handler = ArcadeHandler.getHandler();
        const scaledRealWidth = (maxX + 1) * this.targetScale * handler.FIELD_SECTION_SIZE;
        const scaledRealHeight = (maxY + 1) * this.targetScale * handler.FIELD_SECTION_SIZE;
        this.selectedPos = new Point(
            handler.FIELD_START_POSITION.x + (handler.REAL_FIELD_WIDTH / 2) - (scaledRealWidth / 2),
            handler.FIELD_START_POSITION.y + (handler.REAL_FIELD_HEIGHT / 2) - (scaledRealHeight / 2)
        );
    }

    public setColor(color: RGBColor): void {
        this.color = color.clone();
        this.currentColor = this.grayscale.clone();
    }

}