import Point, {PointArray} from "../util/point.js";
import Sprite from "./sprite.js";

export default class SpriteBlock extends Sprite {

    private _outline = true;
    private _outlineWidth = 2;
    private _size = 32;

    /**
     * Specifies the edges that need to be outlined: top, right, down, left
     */
    public outlineEdges: [boolean, boolean, boolean, boolean] = [true, true, true, true];

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

    private getRawCorners(): Point[] {
        return [
            this.position.clone(),
            this.position.clone().moveBy(this.size, 0),
            this.position.clone().moveBy(this.size, this.size),
            this.position.clone().moveBy(0, this.size)
        ];
    }

    private getEnlargedCorners(): Point[] {
        const rawCorners = this.getRawCorners();
        return [
            rawCorners[0].moveBy(-0.5, -0.5),
            rawCorners[1].moveBy(0.5, -0.5),
            rawCorners[2].moveBy(0.5, 0.5),
            rawCorners[3].moveBy(-0.5, 0.5)
        ];
    }

    private getRotatedCorners(inputCorners: Point[]): Point[] {
        const rotationCenter = this.getRealRotationCenter();
        inputCorners.forEach(corner => corner.rotate(this.rotation, rotationCenter));
        return inputCorners;
        
    }

    private doFullOutline() {
        return this.outline && this.outlineEdges[0] && this.outlineEdges[1] && this.outlineEdges[2] && this.outlineEdges[3];
    }

    protected drawSprite(context: CanvasRenderingContext2D): void {
        const fullOutline = this.doFullOutline();

        context.fillStyle = this.getColor().rgbString;
        const corners = this.getRotatedCorners(fullOutline ? this.getRawCorners() : this.getEnlargedCorners());
        context.beginPath();
        context.moveTo(corners[0].x, corners[0].y);
        for(let i = 1; i < corners.length; i++) {
            context.lineTo(corners[i].x, corners[i].y);
        }
        context.lineTo(corners[0].x, corners[0].y);
        context.fill();

        if(!this.outline) return;

        context.strokeStyle = "black";
        context.lineWidth = this.outlineWidth;
        context.lineCap = "square";

        if(fullOutline) {
            context.stroke();
            return;
        }

        const outlineCorners = this.getRotatedCorners(this.getRawCorners());
        context.beginPath();
        context.moveTo(outlineCorners[0].x, outlineCorners[0].y);
        for(let i = 1; i < outlineCorners.length; i++) {
            if(this.outlineEdges[i - 1]) {
                context.lineTo(outlineCorners[i].x, outlineCorners[i].y);
            } else {
                context.moveTo(outlineCorners[i].x, outlineCorners[i].y);
            }
        }
        if(this.outlineEdges[3]) context.lineTo(outlineCorners[0].x, outlineCorners[0].y);
        context.stroke();
    }

}