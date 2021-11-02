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
        this.isColored = false;
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
    isCurrent() {
        return ArcadeHandler.getHandler().selectedButtonIndex == this.index;
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
    update(delta) {
        if (ArcadeHandler.getHandler().isSelectingStages && this.isCurrent() && !this.isColored) {
            this.fadeEffect?.interrupt();
            this.fadeEffect = new ColorFadeEffect(this.currentColor, this.color, 8);
            this.isColored = true;
        }
        if ((!this.isCurrent() && this.isColored) ||
            (this.isColored && !ArcadeHandler.getHandler().isSelectingStages)) {
            this.fadeEffect?.interrupt();
            this.fadeEffect = new ColorFadeEffect(this.currentColor, this.grayscale, 8);
            this.isColored = false;
        }
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
    }
    setColor(color) {
        this.color = color.clone();
        this.currentColor = this.grayscale.clone();
    }
}
//# sourceMappingURL=stageButton.js.map