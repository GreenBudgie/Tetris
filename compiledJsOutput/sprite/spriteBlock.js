import Point from "../util/point.js";
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
    getRealRotationCenter() {
        return new Point(this.rotationCenter.x * this.size + this.position.x, this.rotationCenter.y * this.size + this.position.y);
    }
    getCorners() {
        const rotationCenter = this.getRealRotationCenter();
        return [
            this.position.clone().rotate(this.rotation, rotationCenter),
            this.position.clone().moveBy(this.size, 0).rotate(this.rotation, rotationCenter),
            this.position.clone().moveBy(this.size, this.size).rotate(this.rotation, rotationCenter),
            this.position.clone().moveBy(0, this.size).rotate(this.rotation, rotationCenter)
        ];
    }
    drawSprite(context) {
        context.fillStyle = this.getColor().rgbString;
        const corners = this.getCorners();
        context.beginPath();
        context.moveTo(corners[0].x, corners[0].y);
        for (let i = 1; i < corners.length; i++) {
            context.lineTo(corners[i].x, corners[i].y);
        }
        context.lineTo(corners[0].x, corners[0].y);
        context.fill();
        if (this.outline) {
            context.strokeStyle = "black";
            context.lineWidth = this.outlineWidth;
            context.lineCap = "square";
            context.stroke();
        }
    }
}
//# sourceMappingURL=spriteBlock.js.map