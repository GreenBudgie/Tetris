import ColorFadeEffect from "../../color/colorFadeEffect.js";
import RGBColor from "../../color/rgbColor.js";
import { easeInOutQuad } from "../../effect/effectEasings.js";
import MoveEffect from "../../effect/moveEffect.js";
import ArcadeHandler from "./arcadeHandler.js";
export default class StageButton {
    constructor(index) {
        this._scale = 1;
        this.grayscale = RGBColor.grayscale(200);
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
    isHovered() {
        return ArcadeHandler.getHandler().hoveredButtonIndex == this.index;
    }
    isSelected() {
        return ArcadeHandler.getHandler().selectedButton == this;
    }
    playAppearEffect() {
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
    playDisappearEffect() {
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
    select() {
    }
    deselect() {
    }
    hover() {
        this.fadeEffect?.interrupt();
        this.fadeEffect = new ColorFadeEffect(this.currentColor, this.color, 8);
    }
    unhover() {
        this.fadeEffect?.interrupt();
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
    getCurrentBlockSize() {
        return this.scale * ArcadeHandler.getHandler().FIELD_SECTION_SIZE;
    }
    getRealXBySection(sectionX) {
        return ArcadeHandler.getHandler().FIELD_START_X + sectionX * this.getCurrentBlockSize();
    }
    getRealYBySection(sectionY) {
        return ArcadeHandler.getHandler().FIELD_START_Y + sectionY * this.getCurrentBlockSize();
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
        this.width = maxX + 1;
        this.height = maxY + 1;
    }
    setColor(color) {
        this.color = color.clone();
        this.currentColor = this.grayscale.clone();
    }
}
//# sourceMappingURL=stageButton.js.map