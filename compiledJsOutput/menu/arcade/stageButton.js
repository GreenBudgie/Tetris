import ColorFadeEffect from "../../color/colorFadeEffect.js";
import { easeInOutQuad } from "../../effect/effectEasings.js";
import MoveEffect from "../../effect/moveEffect.js";
import ArcadeHandler from "./arcadeHandler.js";
export default class StageButton {
    constructor() {
        this.EFFECT_SPEED = 10;
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
    playAppearEffect() {
        this.fadeEffect?.interrupt();
        this.moveEffect?.interrupt();
        ArcadeHandler.getHandler().needsToDraw = true;
        this.currentColor.alpha = 0;
        this.x = this.startX;
        this.y = this.startY;
        this.fadeEffect = new ColorFadeEffect(this.currentColor, this.color, this.EFFECT_SPEED);
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
        const zeroAlpha = this.color.clone();
        zeroAlpha.alpha = 0;
        this.fadeEffect = new ColorFadeEffect(this.currentColor, zeroAlpha, this.EFFECT_SPEED);
        this.fadeEffect.pause(this.EFFECT_SPEED);
        this.fadeEffect.callback = () => ArcadeHandler.getHandler().needsToDraw = false;
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
    }
    setColor(color) {
        this.color = color.clone();
        this.currentColor = color.clone();
    }
}
//# sourceMappingURL=stageButton.js.map