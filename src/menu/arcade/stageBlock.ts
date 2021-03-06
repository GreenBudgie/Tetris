import Colorizable from "../../color/colorizable.js";
import RGBColor from "../../color/rgbColor.js";
import {easeInOutQuad} from "../../effect/effectEasings.js";
import Transition from "../../effect/transition.js";
import InputHandler, {KeyBindings} from "../../main/inputHandler.js";
import Level from "../../game/level.js";
import StateHandler from "../../state/stateHandler.js";
import Point, {Positionable} from "../../util/point.js";
import Processable from "../../util/processable.js";
import ArcadeHandler from "./arcadeHandler.js";
import StageButton from "./stageButton.js";
import StateChangeEffect from "../../effect/stateChangeEffect.js";

export default class StageBlock implements Processable, Colorizable, Positionable {

    private _position: Point;
    private level: Level;
    private stageButton: StageButton;

    private textAlpha = 0;
    private selectionSize = 1;
    public isSelected = false;

    public constructor(relativePosition: Point, level: Level, stageButton: StageButton) {
        this._position = relativePosition;
        this.level = level;
        this.stageButton = stageButton;
    }

    public get position(): Point {
        return this._position;
    }

    private textAlphaTransition: Transition;

    public onStageSelected(): void {
        this.textAlphaTransition?.interrupt();
        this.textAlphaTransition = new Transition(value => this.textAlpha = value, this.textAlpha, 1, 12);
    }

    public onStageDeselected(): void {
        this.textAlphaTransition?.interrupt();
        this.textAlphaTransition = new Transition(value => this.textAlpha = value, this.textAlpha, 0, 12);
        if(this.isSelected) this.deselect();
    }

    private selectionSizeTransition: Transition;

    public select(): void {
        this.selectionSizeTransition?.interrupt();
        this.selectionSizeTransition = new Transition(value => this.selectionSize = value, this.selectionSize, 0.9, 8);
        this.selectionSizeTransition.easing = easeInOutQuad;
        this.isSelected = true;
    }

    public deselect(): void {
        this.selectionSizeTransition?.interrupt();
        this.selectionSizeTransition = new Transition(value => this.selectionSize = value, this.selectionSize, 1, 8);
        this.selectionSizeTransition.easing = easeInOutQuad;
        this.isSelected = false;
    }

    public update(delta: number): void {
        if(this.isSelected && InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_SELECT)) {
            new StateChangeEffect(StateHandler.getHandler().GAME);
        }
    }

    private getBlockSize(): number {
        return ArcadeHandler.getHandler().FIELD_SECTION_SIZE * this.stageButton.scale;
    }

    private getRealStartX(): number {
        return this.stageButton.position.x + this.position.x * this.getBlockSize();
    }

    private getRealStartY(): number {
        return this.stageButton.position.y + this.position.y * this.getBlockSize();
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

        //Draw block
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(startX + blockSize, startY);
        context.lineTo(startX + blockSize, startY + blockSize);
        context.lineTo(startX, startY + blockSize);
        context.lineTo(startX, startY);
        context.fill();
        context.stroke();

        const selectionStartX = startX + blockSize * (1 - this.selectionSize);
        const selectionStartY = startY + blockSize * (1 - this.selectionSize);
        const selectionEndX = startX + blockSize * this.selectionSize;
        const selectionEndY = startY + blockSize * this.selectionSize;

        //Draw level selection
        context.beginPath();
        context.moveTo(selectionStartX, selectionStartY);
        context.lineTo(selectionEndX, selectionStartY);
        context.lineTo(selectionEndX, selectionEndY);
        context.lineTo(selectionStartX, selectionEndY);
        context.lineTo(selectionStartX, selectionStartY);
        context.stroke();
        
        this.drawLevelNumber(context);
    }

    private drawLevelNumber(context: CanvasRenderingContext2D): void {
        context.font = `${this.getScaledFontSize()}px ft_default`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.lineWidth = 2;
        context.strokeStyle = `rgba(0, 0, 0, ${this.textAlpha})`;
        context.fillStyle = `rgba(255, 255, 255, ${this.textAlpha})`;

        const centerX = this.getRealTextCenterX();
        const centerY = this.getRealTextCenterY();

        context.fillText(this.level.levelNumber.toString(), centerX, centerY);
        context.strokeText(this.level.levelNumber.toString(), centerX, centerY);
    }

    public getColor(): RGBColor {
        return this.stageButton.getColor();
    }

}