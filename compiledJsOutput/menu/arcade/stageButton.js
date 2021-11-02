import ColorFadeEffect from "../../color/colorFadeEffect.js";
import RGBColor from "../../color/rgbColor.js";
import { easeInOutQuad, easeInQuad, easeOutQuad } from "../../effect/effectEasings.js";
import MoveEffect from "../../effect/moveEffect.js";
import ScaleEffect from "../../effect/scaleEffect.js";
import ArcadeHandler from "./arcadeHandler.js";
export default class StageButton {
    constructor(index) {
        this._scale = 1;
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
    get x() {
        return this._x;
    }
    set x(x) {
        this._x = x;
    }
    get y() {
        return this._y;
    }
    set y(y) {
        this._y = y;
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
        this.x = this.startX;
        this.y = this.startY;
        this.fadeEffect = new ColorFadeEffect(this.currentColor, this.grayscale, this.EFFECT_SPEED);
        this.moveEffect = new MoveEffect(this, this.endX, this.endY, this.EFFECT_SPEED);
        this.moveEffect.pause(this.EFFECT_SPEED);
        this.moveEffect.easing = easeInOutQuad;
    }
    playDisappearEffect() {
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
        this.scaleEffect?.interruptNoCallback();
        this.scaleEffect = new ScaleEffect(this, this.targetScale, 12);
        this.scaleEffect.easing = easeInQuad;
        this.moveEffect = new MoveEffect(this, this.selectedX, this.selectedY, 12);
        this.moveEffect.easing = easeOutQuad;
    }
    onDeselect() {
        this.moveEffect?.interruptNoCallback();
        this.scaleEffect?.interruptNoCallback();
        this.scaleEffect = new ScaleEffect(this, 1, 12);
        this.scaleEffect.easing = easeOutQuad;
        this.moveEffect = new MoveEffect(this, this.endX, this.endY, 12);
        this.moveEffect.easing = easeInQuad;
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
    }
    draw(context) {
        for (const block of this.blocks) {
            block.draw(context);
        }
    }
    setEndSection(sectionX, sectionY) {
        this.endX = this.getRealXBySection(sectionX);
        this.endY = this.getRealYBySection(sectionY);
    }
    setStartSection(sectionX, sectionY) {
        this.startX = this.getRealXBySection(sectionX);
        this.startY = this.getRealYBySection(sectionY);
        this.x = this.startX;
        this.y = this.startY;
    }
    getRealXBySection(sectionX) {
        return ArcadeHandler.getHandler().FIELD_START_X + sectionX * ArcadeHandler.getHandler().FIELD_SECTION_SIZE;
    }
    getRealYBySection(sectionY) {
        return ArcadeHandler.getHandler().FIELD_START_Y + sectionY * ArcadeHandler.getHandler().FIELD_SECTION_SIZE;
    }
    setBlocks(blocks) {
        this.blocks = blocks;
        let maxX = 0;
        let maxY = 0;
        for (const block of this.blocks) {
            if (block.x > maxX)
                maxX = block.x;
            if (block.y > maxY)
                maxY = block.y;
        }
        const handler = ArcadeHandler.getHandler();
        const scaledRealWidth = (maxX + 1) * this.targetScale * handler.FIELD_SECTION_SIZE;
        const scaledRealHeight = (maxY + 1) * this.targetScale * handler.FIELD_SECTION_SIZE;
        this.selectedX = handler.FIELD_START_X + (handler.REAL_FIELD_WIDTH / 2) - (scaledRealWidth / 2);
        this.selectedY = handler.FIELD_START_Y + (handler.REAL_FIELD_HEIGHT / 2) - (scaledRealHeight / 2);
    }
    setColor(color) {
        this.color = color.clone();
        this.currentColor = this.grayscale.clone();
    }
}
//# sourceMappingURL=stageButton.js.map