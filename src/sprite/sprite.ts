import Colorizable from "../color/colorizable.js";
import RGBColor from "../color/rgbColor.js";
import Point, {Positionable} from "../util/point.js";
import {Drawable} from "../util/processable.js";

/**
 * A sprite represents a procedurally drawn image
 */
export default abstract class Sprite implements Drawable, Positionable, Colorizable {

    private _position: Point = Point.zero();
    private _rotation: number = 0;
    protected rotationSinCos: [number, number] = [0, 1];
    private _rotationCenter: Point = Point.zero();
    private _color: RGBColor = RGBColor.grayscale(255);
    private _visible: boolean = true;

    public get rotationCenter(): Point {
        return this._rotationCenter;
    }

    public getRealRotationCenter(): Point {
        return new Point(this._rotationCenter.x + this.position.x, this._rotationCenter.y + this.position.y);
    }

    public set rotation(rotation: number) {
        this._rotation = rotation;
        this.rotationSinCos = [Math.sin(this._rotation), Math.cos(this._rotation)];
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

    public get position(): Point {
        return this._position;
    }

    draw(context: CanvasRenderingContext2D): void {
        if(this._visible) this.drawSprite(context);
    }

    protected abstract drawSprite(context: CanvasRenderingContext2D): void;

}