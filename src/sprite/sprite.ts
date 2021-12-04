import Colorizable from "../color/colorizable.js";
import RGBColor from "../color/rgbColor.js";
import Drawable from "../util/drawable.js";
import Positionable from "../util/positionable.js";
import Scalable from "../util/scalable.js";

/**
 * A sprite represents a procedurally drawn image
 */
export default abstract class Sprite implements Drawable, Positionable, Scalable, Colorizable {

    private _x: number = 0;
    private _y: number = 0;
    private _scale: number = 1;
    private _rotation: number = 0;
    private _rotationCenter: [number, number] = [0, 0];
    private _color: RGBColor = RGBColor.grayscale(255);
    private _visible: boolean = true;

    public get rotationCenter(): [number, number] {
        return this._rotationCenter;
    }

    public set rotationCenter(rotationCenter: [number, number]) {
        this._rotationCenter = rotationCenter;
    }

    public set rotation(rotation: number) {
        this._rotation = rotation;
    }

    public get rotation() {
        return this._rotation;
    }

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
        if(this._visible) this.drawSprite(context);
    }

    protected abstract drawSprite(context: CanvasRenderingContext2D): void;

}