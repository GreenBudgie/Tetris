import Point from "../util/point.js";
import Sprite from "./sprite.js";

export default class SpriteFigure extends Sprite {

    private readonly _shape: Point[];
    private _blockSize: number = 32;
    private _outlineMode: "block" | "border" | "none" = "border";
    private _outlineWidth: number = 2;

    private readonly blockWidth: number;
    private readonly blockHeight: number;

    public constructor(shape: Point[]) {
        super();
        this._shape = shape;
        this.blockWidth = this.calculateBlockWidth();
        this.blockHeight = this.calculateBlockHeight();
    }

    private calculateBlockWidth(): number {
        let maxX = 0;
        for(const blockPos of this.shape) {
            if(blockPos.x > maxX) maxX = blockPos.x;
        }
        return maxX + 1;
    }

    private calculateBlockHeight(): number {
        let maxY = 0;
        for(const blockPos of this.shape) {
            if(blockPos.y > maxY) maxY = blockPos.y;
        }
        return maxY + 1;
    }

    public getBlockWidth(): number {
        return this.blockWidth;
    }

    public getBlockHeight(): number {
        return this.blockHeight;
    }

    public getRealWidth(): number {
        return this.blockWidth * this.blockSize;
    }
    public getRealHeight(): number {
        return this.blockHeight * this.blockSize;
    }

    public get shape() {
        return this._shape;
    }

    public get blockSize() {
        return this._blockSize;
    }

    public set blockSize(blockSize: number) {
        this._blockSize = blockSize;
    }

    public get outlineMode(): "block" | "border" | "none" {
        return this._outlineMode;
    }

    public set outlineMode(value: "block" | "border" | "none") {
        this._outlineMode = value;
    }

    public get outlineWidth(): number {
        return this._outlineWidth;
    }

    public set outlineWidth(value: number) {
        this._outlineWidth = value;
    }

    public setOutlineWidthBasedOnBlockSize() {
        this._outlineWidth = Math.round(this.blockSize / 20);
    }

    private getBlockDrawStartPosition(blockPos: Point): Point {
        const xNoRotation = this.position.x + blockPos.x * this.blockSize;
        const yNoRotation = this.position.y + blockPos.y * this.blockSize;
        if(this.rotation == 0) {
            return new Point(xNoRotation, yNoRotation);
        }
        const originX = xNoRotation - this.getRealRotationCenter().x;
        const originY = yNoRotation - this.getRealRotationCenter().y;
        const rotatedX = originX * this.rotationSinCos[1] - originY * this.rotationSinCos[0];
        const rotatedY = originX * this.rotationSinCos[0] + originY * this.rotationSinCos[1];
        return new Point(rotatedX + this.getRealRotationCenter().x, rotatedY + this.getRealRotationCenter().y);
    }

    protected drawSprite(context: CanvasRenderingContext2D): void {
        context.fillStyle = this.getColor().rgbString;
        context.strokeStyle = "black";
        context.lineWidth = this._outlineWidth;
        context.lineCap = "square";
        const shift = this._outlineWidth % 2 == 0 ? 0 : 0.5;
        const outlineBlocks = this._outlineMode == "block";
        for(const blockPos of this.shape) {
            const startPos = this.getBlockDrawStartPosition(blockPos);
            let currentStartX = startPos.x;
            let currentStartY = startPos.y;
            context.beginPath();
            context.moveTo(currentStartX - 1, currentStartY - 1);
            context.lineTo(currentStartX + this.blockSize + 1, currentStartY - 1);
            context.lineTo(currentStartX + this.blockSize + 1, currentStartY + this.blockSize + 1);
            context.lineTo(currentStartX - 1, currentStartY + this.blockSize + 1);
            context.lineTo(currentStartX - 1, currentStartY - 1);
            context.fill();

            if(this._outlineMode == "none") continue;
            currentStartX -= shift;
            currentStartY -= shift;

            context.beginPath();
            context.moveTo(currentStartX, currentStartY);

            if(this.isFree(blockPos, 0, -1) || outlineBlocks) {
                context.lineTo(currentStartX + this.blockSize, currentStartY);
            } else {
                context.moveTo(currentStartX + this.blockSize, currentStartY);
            }

            if(this.isFree(blockPos, 1, 0) || outlineBlocks) {
                context.lineTo(currentStartX + this.blockSize, currentStartY + this.blockSize);
            } else {
                context.moveTo(currentStartX + this.blockSize, currentStartY + this.blockSize);
            }

            if(this.isFree(blockPos, 0, 1) || outlineBlocks) {
                context.lineTo(currentStartX, currentStartY + this.blockSize);
            } else {
                context.moveTo(currentStartX, currentStartY + this.blockSize);
            }

            if(this.isFree(blockPos, -1, 0) || outlineBlocks) {
                context.lineTo(currentStartX, currentStartY);
            }

            context.stroke();
        }
    }

    private isFree(blockPos: Point, dx: number, dy: number) {
        return !this.shape.some(pos => pos.x == blockPos.x + dx && pos.y == blockPos.y + dy);
    }

}