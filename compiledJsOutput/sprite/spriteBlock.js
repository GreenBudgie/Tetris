import Sprite from "./sprite.js";
export default class SpriteBlock extends Sprite {
    constructor() {
        super(...arguments);
        this._outline = true;
        this._outlineWidth = 2;
        this._size = 32;
    }
    get outline() {
        return this._outline;
    }
    set outline(value) {
        this._outline = value;
    }
    get outlineWidth() {
        return this._outlineWidth;
    }
    set outlineWidth(value) {
        this._outlineWidth = value;
    }
    get size() {
        return this._size;
    }
    set size(value) {
        this._size = value;
    }
    setOutlineWidthBasedOnSize() {
        this._outlineWidth = Math.round(this.size / 20);
    }
    drawSprite(context) {
    }
}
//# sourceMappingURL=spriteBlock.js.map