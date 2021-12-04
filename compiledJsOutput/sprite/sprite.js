import RGBColor from "../color/rgbColor.js";
/**
 * A sprite represents a procedurally drawn image
 */
export default class Sprite {
    constructor() {
        this._x = 0;
        this._y = 0;
        this._scale = 1;
        this._rotation = 0;
        this._rotationCenter = [0, 0];
        this._color = RGBColor.grayscale(255);
        this._visible = true;
    }
    get rotationCenter() {
        return this._rotationCenter;
    }
    set rotationCenter(rotationCenter) {
        this._rotationCenter = rotationCenter;
    }
    set rotation(rotation) {
        this._rotation = rotation;
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
    get scale() {
        return this._scale;
    }
    set scale(scale) {
        this._scale = scale;
    }
    draw(context) {
        if (this._visible)
            this.drawSprite(context);
    }
}
//# sourceMappingURL=sprite.js.map