import ColorFadeEffect from "../../color/colorFadeEffect.js";
import { easeOutQuad } from "../../effect/effectEasings.js";
import MoveEffect from "../../effect/moveEffect.js";
import ArcadeHandler from "./arcadeHandler.js";
export default class StageButton {
    constructor() {
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
    playEffect() {
        this.currentColor.alpha = 0;
        this.x = this.startX;
        this.y = this.startY;
        const fade = new ColorFadeEffect(this.currentColor, this.color, 12);
        const move = new MoveEffect(this, this.endX, this.endY, 12);
        move.pause(12);
        move.easing = easeOutQuad;
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
        this.color = color;
        this.currentColor = color.clone();
    }
}
//# sourceMappingURL=stageButton.js.map