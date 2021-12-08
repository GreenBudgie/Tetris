import Colorizable from "../color/colorizable.js";
import RGBColor from "../color/rgbColor.js";
import SpriteBlock from "../sprite/spriteBlock.js";
import Point from "../util/point.js";
import Processable from "../util/processable.js";
import Figure from "./Figure.js";
import GameProcess from "./gameProcess.js";

export abstract class AbstractBlock implements Processable {

	public readonly section: Point;
	public readonly sprite: SpriteBlock;
	
	constructor(section: Point) {
		this.section = section;
		this.sprite = new SpriteBlock();
		this.sprite.outline = true;
		this.sprite.outlineWidth = 1;
	}

	public update(delta: number): void {}

	public draw(context: CanvasRenderingContext2D) {
		this.sprite.draw(context);
	}

}

/**
 * Represents a block that takes place at the field
 */
export class FieldBlock extends AbstractBlock {

	constructor(section: Point) {
		super(section);
		this.setSpritePosition();
	}

	public moveDown() {
		this.section.y += 1;
		this.setSpritePosition();
	}

	public setSpritePosition() {
		const process = GameProcess.getCurrentProcess();
		this.sprite.position.x = process.field.getRealFieldPosition().x + this.section.x * process.field.realSectionSize;
		this.sprite.position.y = process.field.getRealFieldPosition().y + this.section.y * process.field.realSectionSize;
	}

}

/**
 * Represents a block that is attached to a figure
 */
export class FigureBlock extends AbstractBlock {

	private _figure: Figure;

	public get figure(): Figure {
		return this._figure;
	}

	public set figure(value: Figure) {
		this._figure = value;
		this.sprite.getColor().setTo(this._figure.getColor());
	}

	/**
	 * Checks whether the block is able to move right
	 * @returns ALLOW if the block is able to move right, BOUNDARY if a wall obstructs the movement, BLOCK if a block obstructs the movement
	 */
	public checkMoveRight(): MoveResult {
		return this.checkMove(1, 0);
	}

	/**
	 * Checks whether the block is able to move left
	 * @returns ALLOW if the block is able to move left, BOUNDARY if a wall obstructs the movement, BLOCK if a block obstructs the movement
	 */
	public checkMoveLeft(): MoveResult {
		return this.checkMove(-1, 0);
	}

	/**
	 * Checks whether the block is able to move down
	 * @returns ALLOW if the block is able to move down, BOUNDARY if a floor obstructs the movement, BLOCK if a block obstructs the movement
	 */
	public checkMoveDown(): MoveResult {
		return this.checkMove(0, 1);
	}

	/**
	 * Checks whether the block is able to move by specified deltas
	 * @returns ALLOW if the block is able to move by specified deltas, BOUNDARY if a floor obstructs the movement, BLOCK if a block obstructs the movement
	 */
	public checkMove(dx: number, dy: number): MoveResult {
		const field = GameProcess.getCurrentProcess().field;
		const newSectionX = this.getSectionX() + dx;
		const newSectionY = this.getSectionY() + dy;
		for(const block of field.blocks) {
			if(newSectionX == block.section.x && newSectionY == block.section.y) return MoveResult.BLOCK;
		}
		if(field.isSectionInside(newSectionX, newSectionY)) return MoveResult.ALLOW;
		return MoveResult.BOUNDARY;
	}

	public getRealX(): number {
		const process = GameProcess.getCurrentProcess();
		return this.getSectionX() * process.field.realSectionSize + process.field.getRealFieldX();
	}

	public getRealY(): number {
		const process = GameProcess.getCurrentProcess();
		return this.getSectionY() * process.field.realSectionSize + process.field.getRealFieldY();
	}

	public getSectionX(): number {
		return this.x + this._figure.sectionX;
	}

	public getSectionY(): number {
		return this.y + this._figure.sectionY;
	}

	public getShadowSectionY(): number {
		return this.y + this._figure.getShadowSectionY();
	}

	public getRealShadowY(): number {
		const process = GameProcess.getCurrentProcess();
		return process.field.getRealFieldY() + this.getShadowSectionY() * process.field.realSectionSize;
	}

	public checkRotation(): MoveResult {
		const field = GameProcess.getCurrentProcess().field;
		const rotatedFieldX = this.findRotatedRelativeX() + this._figure.sectionX;
		const rotatedFieldY = this.findRotatedRelativeY() + this._figure.sectionY;
		if(!field.isSectionInsideOrAbove(rotatedFieldX, rotatedFieldY)) return MoveResult.BOUNDARY;
		for(const field_block of field.blocks) {
			if(field_block.getFieldSectionX() == rotatedFieldX && field_block.getFieldSectionY() == rotatedFieldY) 
			return MoveResult.BLOCK;
		}
		return MoveResult.ALLOW;
	}

	public findRotatedRelativeX(): number {
		const originY = this.y - this._figure.rotationCenterY;
		const rotatedOriginX = -originY;
		return rotatedOriginX + this._figure.rotationCenterX;
	}

	public findRotatedRelativeY(): number {
		const originX = this.x - this._figure.rotationCenterX;
		const rotatedOriginY = originX;
		return rotatedOriginY + this._figure.rotationCenterY;
	}

	public rotateNoRestrictions() {
		const rotatedX = this.findRotatedRelativeX();
		const rotatedY = this.findRotatedRelativeY();
		this.x = rotatedX;
		this.y = rotatedY;
	}

	public getRelativeX(): number {
		return this.x;
	}

	public getRelativeY(): number {
		return this.y;
	}

	public getPreviewRealX(): number {
		return this.x * GameProcess.getCurrentProcess().field.realSectionSize + this._figure.getPreviewRealX();
	}

	public getPreviewRealY(): number {
		return this.y * GameProcess.getCurrentProcess().field.realSectionSize + this._figure.getPreviewRealY();
	}

	/**
	 * Creates a field block with the same coordinates and color
	 * @returns A new field block
	 */
	public toFieldBlock(): FieldBlock {
		const fieldBlock = new FieldBlock(this.getSectionX(), this.getSectionY());
		fieldBlock.color = this.getColor();
		return fieldBlock;
	}

	public drawAsPreview(context: CanvasRenderingContext2D) {
		const startX = this.getPreviewRealX() + 0.5;
		const startY = this.getPreviewRealY() + 0.5;
		this.prepareContextPath(startX, startY, context);
		this.fillBlock(this.getColor().rgbString, context);
		this.outlineBlock(context);
	}

	public override draw(context: CanvasRenderingContext2D) {
		super.draw(context);
	}

	public drawShadow(context: CanvasRenderingContext2D) {
		const shadowSectionY = this.getShadowSectionY();
		const currentSectionY = this.getSectionY();
		if(shadowSectionY != currentSectionY) {
			const shadowRealX = this.getRealX() + 0.5;
			const shadowRealY = this.getRealShadowY() + 0.5;
			this.prepareContextPath(shadowRealX, shadowRealY, context);
			this.fillBlock("rgb(230, 230, 230)", context);
			this.outlineBlock(context);
		}
	}

}

export enum MoveResult {
	/**
	 * Block is able to move
	 */
	ALLOW,
	/**
	 * Movement is obstructed by a wall or a floor
	 */
	BOUNDARY,
	/**
	 * Movement is obstucted by another block
	 */
	BLOCK
}