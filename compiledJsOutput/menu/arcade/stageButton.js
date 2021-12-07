import ColorFadeEffect from "../../color/colorFadeEffect.js";
import RGBColor from "../../color/rgbColor.js";
import { easeInOutQuad, easeInQuad, easeOutQuad } from "../../effect/effectEasings.js";
import MoveEffect from "../../effect/moveEffect.js";
import Transition from "../../effect/transition.js";
import InputHandler, { KeyBindings } from "../../main/inputHandler.js";
import Point from "../../util/point.js";
import ArcadeHandler from "./arcadeHandler.js";
export default class StageButton {
    constructor(index) {
        this._scale = 1;
        this.startPos = Point.zero();
        this.grayscale = RGBColor.grayscale(200);
        this.targetScale = 2;
        this.EFFECT_SPEED = 10;
        this.index = index;
    }
    get scale() {
        return this._scale;
    }
    set scale(scale) {
        this._scale = scale;
    }
    get position() {
        return this._position;
    }
    getColor() {
        return this.currentColor;
    }
    isHoveredOrSelected() {
        return ArcadeHandler.getHandler().hoveredButtonIndex == this.index;
    }
    playAppearEffect() {
        this.fadeEffect?.interruptNoCallback();
        this.moveEffect?.interruptNoCallback();
        this.currentColor.alpha = 0;
        this.position.setPositionTo(this.startPos);
        this.fadeEffect = new ColorFadeEffect(this.currentColor, this.grayscale, this.EFFECT_SPEED);
        this.moveEffect = new MoveEffect(this, this.endPos, this.EFFECT_SPEED);
        this.moveEffect.pause(this.EFFECT_SPEED);
        this.moveEffect.easing = easeInOutQuad;
    }
    playDisappearEffect() {
        this.fadeEffect?.interruptNoCallback();
        this.moveEffect?.interruptNoCallback();
        this.position.setPositionTo(this.endPos);
        this.moveEffect = new MoveEffect(this, this.startPos, this.EFFECT_SPEED);
        this.moveEffect.easing = easeInOutQuad;
        const zeroAlpha = this.currentColor.clone();
        zeroAlpha.alpha = 0;
        this.fadeEffect = new ColorFadeEffect(this.currentColor, zeroAlpha, this.EFFECT_SPEED);
        this.fadeEffect.pause(this.EFFECT_SPEED);
        this.fadeEffect.callback = () => ArcadeHandler.getHandler().state = "hide";
    }
    hideWhenAnotherSelected() {
        this.fadeEffect?.interruptNoCallback();
        const zeroAlpha = this.currentColor.clone();
        zeroAlpha.alpha = 0;
        this.fadeEffect = new ColorFadeEffect(this.currentColor, zeroAlpha, 10);
    }
    showWhenAnotherDeselected() {
        this.fadeEffect?.interruptNoCallback();
        this.fadeEffect = new ColorFadeEffect(this.currentColor, this.grayscale, 10);
    }
    onSelect() {
        this.moveEffect?.interruptNoCallback();
        this.scaleTransition?.interruptNoCallback();
        this.scaleTransition = new Transition(value => { this.scale = value; }, this.scale, this.targetScale, 12);
        this.scaleTransition.easing = easeInQuad;
        this.moveEffect = new MoveEffect(this, this.selectedPos, 12);
        this.moveEffect.easing = easeOutQuad;
        this.blocks.forEach(block => block.onStageSelected());
        this.blocks[0].select();
    }
    onDeselect() {
        this.moveEffect?.interruptNoCallback();
        this.scaleTransition?.interruptNoCallback();
        this.scaleTransition = new Transition(value => { this.scale = value; }, this.scale, 1, 12);
        this.scaleTransition.easing = easeOutQuad;
        this.moveEffect = new MoveEffect(this, this.endPos, 12);
        this.moveEffect.easing = easeInQuad;
        this.blocks.forEach(block => block.onStageDeselected());
    }
    onHover() {
        this.fadeEffect?.interruptWithCallback();
        this.fadeEffect = new ColorFadeEffect(this.currentColor, this.color, 8);
    }
    onUnhover() {
        this.fadeEffect?.interruptWithCallback();
        this.fadeEffect = new ColorFadeEffect(this.currentColor, this.grayscale, 8);
    }
    update(delta) {
        if (ArcadeHandler.getHandler().state == "levelSelect") {
            this.handleSelectionMovement();
        }
        this.blocks.forEach(block => block.update(delta));
    }
    handleSelectionMovement() {
        let blockDeltaX = 0;
        let blockDeltaY = 0;
        const input = InputHandler.getHandler();
        if (input.isKeyBindingPressed(KeyBindings.MENU_UP)) {
            blockDeltaY = -1;
        }
        else if (input.isKeyBindingPressed(KeyBindings.MENU_RIGHT)) {
            blockDeltaX = 1;
        }
        else if (input.isKeyBindingPressed(KeyBindings.MENU_DOWN)) {
            blockDeltaY = 1;
        }
        else if (input.isKeyBindingPressed(KeyBindings.MENU_LEFT)) {
            blockDeltaX = -1;
        }
        if (blockDeltaX != 0 || blockDeltaY != 0) {
            const selectedBlock = this.getSelectedBlock();
            if (selectedBlock != undefined) {
                const nextBlock = this.getBlockByPos(selectedBlock.position.x + blockDeltaX, selectedBlock.position.y + blockDeltaY);
                if (nextBlock != undefined) {
                    selectedBlock.deselect();
                    nextBlock.select();
                }
                else {
                    ArcadeHandler.getHandler().stopLevelSelect();
                }
            }
        }
    }
    getSelectedBlock() {
        return this.blocks.find(block => block.isSelected);
    }
    getBlockByPos(relativeX, relativeY) {
        return this.blocks.find(block => block.position.x == relativeX && block.position.y == relativeY);
    }
    draw(context) {
        this.blocks.forEach(block => block.draw(context));
    }
    setEndSection(sectionPosition) {
        this.endPos = this.getRealPositionBySection(sectionPosition);
    }
    setStartSection(sectionPosition) {
        this.startPos = this.getRealPositionBySection(sectionPosition);
        this._position = this.startPos.clone();
    }
    getRealPositionBySection(sectionPosition) {
        const handler = ArcadeHandler.getHandler();
        return new Point(handler.FIELD_START_POSITION.x + sectionPosition.x * handler.FIELD_SECTION_SIZE, handler.FIELD_START_POSITION.y + sectionPosition.y * handler.FIELD_SECTION_SIZE);
    }
    setBlocks(blocks) {
        this.blocks = blocks;
        let maxX = 0;
        let maxY = 0;
        for (const block of this.blocks) {
            if (block.position.x > maxX)
                maxX = block.position.x;
            if (block.position.y > maxY)
                maxY = block.position.y;
        }
        const handler = ArcadeHandler.getHandler();
        const scaledRealWidth = (maxX + 1) * this.targetScale * handler.FIELD_SECTION_SIZE;
        const scaledRealHeight = (maxY + 1) * this.targetScale * handler.FIELD_SECTION_SIZE;
        this.selectedPos = new Point(handler.FIELD_START_POSITION.x + (handler.REAL_FIELD_WIDTH / 2) - (scaledRealWidth / 2), handler.FIELD_START_POSITION.y + (handler.REAL_FIELD_HEIGHT / 2) - (scaledRealHeight / 2));
    }
    setColor(color) {
        this.color = color.clone();
        this.currentColor = this.grayscale.clone();
    }
}
//# sourceMappingURL=stageButton.js.map