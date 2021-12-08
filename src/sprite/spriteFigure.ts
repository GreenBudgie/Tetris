import { FigurePattern } from "../game/Figure.js";
import Point from "../util/point.js";
import Sprite from "./sprite.js";
import SpriteBlock from "./spriteBlock.js";

export default class SpriteFigure extends Sprite {

    private readonly _shape: Point[];
    private readonly blocks: SpriteBlock[] = [];
    private _blockSize: number = 32;
    private _outlineMode: "block" | "border" | "none" = "border";
    private _outlineWidth: number = 2;

    private readonly blockWidth: number;
    private readonly blockHeight: number;

    public constructor(shape: Point[]) {
        super();
        shape.forEach(point => {
            this.blocks.push(new SpriteBlock());
        });
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

    protected drawSprite(context: CanvasRenderingContext2D): void {
        this.blocks.forEach((block, index) => {
            const blockPos = this.shape[index];

            block.getColor().setTo(this.getColor());
            block.size = this.blockSize;
            block.outline = this.outlineMode != "none";
            block.outlineWidth = this.outlineWidth;
            block.rotation = this.rotation;
            
            block.rotationCenter.setPosition(
                this.rotationCenter.x - this._shape[index].x,
                this.rotationCenter.y - this._shape[index].y
            );

            block.position.setPosition(
                this.position.x + this._shape[index].x * this.blockSize,
                this.position.y + this._shape[index].y * this.blockSize
            );

            if(this.outlineMode == "border") {
                block.outlineEdges = [false, false, false, false];
                if(this.isFree(blockPos, 0, -1)) {
                    block.outlineEdges[0] = true;
                }
                if(this.isFree(blockPos, 1, 0)) {
                    block.outlineEdges[1] = true;
                }
                if(this.isFree(blockPos, 0, 1)) {
                    block.outlineEdges[2] = true;
                }
                if(this.isFree(blockPos, -1, 0)) {
                    block.outlineEdges[3] = true;
                }
            } else {
                block.outlineEdges = [true, true, true, true];
            }
            block.draw(context);
        });
    }

    private isFree(blockPos: Point, dx: number, dy: number) {
        return !this.shape.some(pos => pos.x == blockPos.x + dx && pos.y == blockPos.y + dy);
    }

}