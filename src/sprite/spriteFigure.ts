import Sprite from "./sprite.js";

export default class SpriteFigure extends Sprite {

    private readonly _shape: [number, number][];
    private _blockSize: number = 32;
    private _outlineMode: "block" | "border" | "none" = "border";
    private _outlineWidth: number = 2;

    public constructor(shape: [number, number][]) {
        super();
        this._shape = shape;
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

    protected drawSprite(context: CanvasRenderingContext2D): void {
        context.fillStyle = this.getColor().rgbString;
        context.strokeStyle = "black";
        context.lineWidth = this._outlineWidth;
        context.lineCap = "square";
        const shift = this._outlineWidth % 2 == 0 ? 0 : 0.5;
        const outlineBlocks = this._outlineMode == "block";
        for(const blockPos of this.shape) {
            let currentStartX = this.x + blockPos[0] * this.blockSize;
            let currentStartY = this.y + blockPos[1] * this.blockSize;
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

    private isFree(blockPos: [number, number], dx: number, dy: number) {
        return !this.shape.some(pos => pos[0] == blockPos[0] + dx && pos[1] == blockPos[1] + dy);
    }

}