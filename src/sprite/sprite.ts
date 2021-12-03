import Colorizable from "../color/colorizable.js";
import RGBColor from "../color/rgbColor.js";
import rgbColor from "../color/rgbColor.js";
import Drawable from "../util/drawable.js";
import Positionable from "../util/positionable.js";
import Scalable from "../util/scalable.js";

/**
 * A sprite represents an image which is procedurally drawn
 */
export default abstract class Sprite implements Drawable, Positionable, Scalable, Colorizable {

    private _x: number;
    private _y: number;
    private _scale: number;
    private _color: RGBColor;

    private _visible: boolean = true;

    public isVisible() {
        return this._visible;
    }

    public hide() {
        this._visible = false;
    }

    public show() {
        this._visible = true;
    }

    public setVisible(visible: boolean) {
        this._visible = visible;
    }

    getColor(): RGBColor {
        return this._color;
    }

    get x(): number {
        return this._x;
    }

    set x(x: number) {
        this._x = x;
    }

    get y(): number {
        return this._y;
    }

    set y(y: number) {
        this._y = y;
    }

    get scale(): number {
        return this._scale;
    }

    set scale(scale: number) {
        this._scale = scale;
    }

    draw(context: CanvasRenderingContext2D): void {
        if(this._visible) this.drawSprite(context, this._x, this._y, this._scale, this._color);
    }

    protected abstract drawSprite(context: CanvasRenderingContext2D, 
        x: number, y: number, scale: number, color: RGBColor): void;

}