import Sprite from "./sprite.js";

export default class SpriteBlock extends Sprite {

    private _outline = true;
    private _outlineWidth = 2;
    private _size = 32;

    public get outline() {
        return this._outline;
    }
    public set outline(value) {
        this._outline = value;
    }

    public get outlineWidth() {
        return this._outlineWidth;
    }
    public set outlineWidth(value) {
        this._outlineWidth = value;
    }

    public get size() {
        return this._size;
    }
    public set size(value) {
        this._size = value;
    }

    public setOutlineWidthBasedOnSize() {
        this._outlineWidth = Math.round(this.size / 20);
    }

    protected drawSprite(context: CanvasRenderingContext2D): void {
        
    }

}