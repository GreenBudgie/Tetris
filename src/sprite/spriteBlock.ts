import Point, {PointArray} from "../util/point.js";
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

    public override getRealRotationCenter() {
        return new Point(
            this.rotationCenter.x * this.size + this.position.x, 
            this.rotationCenter.y * this.size + this.position.y
        );
    }

    private getCorners(): Point[] {
        const rotationCenter = this.getRealRotationCenter();
        return [
            this.position.clone().rotate(this.rotation, rotationCenter),
            this.position.clone().moveBy(this.size, 0).rotate(this.rotation, rotationCenter),
            this.position.clone().moveBy(this.size, this.size).rotate(this.rotation, rotationCenter),
            this.position.clone().moveBy(0, this.size).rotate(this.rotation, rotationCenter)
        ];
    }

    protected drawSprite(context: CanvasRenderingContext2D): void {
        context.fillStyle = this.getColor().rgbString;
        const corners = this.getCorners();
        context.beginPath();
        context.moveTo(corners[0].x, corners[0].y);
        for(let i = 1; i < corners.length; i++) {
            context.lineTo(corners[i].x, corners[i].y);
        }
        context.lineTo(corners[0].x, corners[0].y);
        context.fill();
        if(this.outline) {
            context.strokeStyle = "black";
            context.lineWidth = this.outlineWidth;
            context.lineCap = "square";
            context.stroke();
        }
    }

}