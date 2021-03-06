import { easeInOutQuad } from "../../effect/effectEasings.js";
import Transition from "../../effect/transition.js";
import InputHandler, { KeyBindings } from "../../main/inputHandler.js";
import StateHandler from "../../state/stateHandler.js";
import ArcadeHandler from "./arcadeHandler.js";
import StateChangeEffect from "../../effect/stateChangeEffect.js";
export default class StageBlock {
    constructor(relativePosition, level, stageButton) {
        this.textAlpha = 0;
        this.selectionSize = 1;
        this.isSelected = false;
        this._position = relativePosition;
        this.level = level;
        this.stageButton = stageButton;
    }
    get position() {
        return this._position;
    }
    onStageSelected() {
        this.textAlphaTransition?.interrupt();
        this.textAlphaTransition = new Transition(value => this.textAlpha = value, this.textAlpha, 1, 12);
    }
    onStageDeselected() {
        this.textAlphaTransition?.interrupt();
        this.textAlphaTransition = new Transition(value => this.textAlpha = value, this.textAlpha, 0, 12);
        if (this.isSelected)
            this.deselect();
    }
    select() {
        this.selectionSizeTransition?.interrupt();
        this.selectionSizeTransition = new Transition(value => this.selectionSize = value, this.selectionSize, 0.9, 8);
        this.selectionSizeTransition.easing = easeInOutQuad;
        this.isSelected = true;
    }
    deselect() {
        this.selectionSizeTransition?.interrupt();
        this.selectionSizeTransition = new Transition(value => this.selectionSize = value, this.selectionSize, 1, 8);
        this.selectionSizeTransition.easing = easeInOutQuad;
        this.isSelected = false;
    }
    update(delta) {
        if (this.isSelected && InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_SELECT)) {
            new StateChangeEffect(StateHandler.getHandler().GAME);
        }
    }
    getBlockSize() {
        return ArcadeHandler.getHandler().FIELD_SECTION_SIZE * this.stageButton.scale;
    }
    getRealStartX() {
        return this.stageButton.position.x + this.position.x * this.getBlockSize();
    }
    getRealStartY() {
        return this.stageButton.position.y + this.position.y * this.getBlockSize();
    }
    getRealTextCenterX() {
        return this.getRealStartX() + this.getBlockSize() / 2;
    }
    getRealTextCenterY() {
        return this.getRealStartY() + this.getBlockSize() / 2;
    }
    getScaledFontSize() {
        return 40 * this.stageButton.scale;
    }
    draw(context) {
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
    drawLevelNumber(context) {
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
    getColor() {
        return this.stageButton.getColor();
    }
}
//# sourceMappingURL=stageBlock.js.map