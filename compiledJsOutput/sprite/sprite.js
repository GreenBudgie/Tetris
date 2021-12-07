import RGBColor from "../color/rgbColor.js";
import Point from "../util/point.js";
/**
 * A sprite represents a procedurally drawn image
 */
export default class Sprite {
    constructor() {
        this._position = Point.zero();
        this._rotation = 0;
        this.rotationSinCos = [0, 1];
        this._rotationCenter = Point.zero();
        this._color = RGBColor.grayscale(255);
        this._visible = true;
    }
    get rotationCenter() {
        return this._rotationCenter;
    }
    getRealRotationCenter() {
        return new Point(this._rotationCenter.x + this.position.x, this._rotationCenter.y + this.position.y);
    }
    set rotation(rotation) {
        this._rotation = rotation % (2 * Math.PI);
        this.rotationSinCos = [Math.sin(this._rotation), Math.cos(this._rotation)];
    }
    get rotation() {
        return this._rotation;
    }
    isVisible() {
        return this._visible;
    }
    hide() {
        this._visible = false;
    }
    show() {
        this._visible = true;
    }
    setVisible(visible) {
        this._visible = visible;
    }
    getColor() {
        return this._color;
    }
    get position() {
        return this._position;
    }
    draw(context) {
        if (this._visible)
            this.drawSprite(context);
    }
}
//# sourceMappingURL=sprite.js.map