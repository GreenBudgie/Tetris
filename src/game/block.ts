import Colorizable from "../color/colorizable.js";
import RGBColor from "../color/rgbColor.js";
import Processable from "../util/processable.js";
import Figure from "./Figure.js";
import GameProcess from "./gameProcess.js";

export abstract class AbstractBlock implements Colorizable, Processable {
	protected x: number;
	protected y: number;
	
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public update(delta: number): void {}

	public abstract getColor(): RGBColor;

	/**
	 * Gets the real X section position of the current block on the screen
	 */
	public abstract getRealX(): number;

	/**
	 * Gets the real Y section position of the current block on the screen
	 */
	public abstract getRealY(): number;

	public draw(context: CanvasRenderingContext2D) {
		const blockStartX = this.getRealX() + 0.5;
		const blockStartY = this.getRealY() + 0.5;
		this.prepareContextPath(blockStartX, blockStartY, context);
		this.fillBlock(this.getColor().rgbString, context);
		this.outlineBlock(context);
	}

	protected prepareContextPath(startX: number, startY: number, context: CanvasRenderingContext2D) {
		const sectionSize = GameProcess.getCurrentProcess().field.realSectionSize;
		context.beginPath();
		context.moveTo(startX, startY);
		context.lineTo(startX + sectionSize, startY);
		context.lineTo(startX + sectionSize, startY + sectionSize);
		context.lineTo(startX, startY + sectionSize);
		context.closePath();
	}

	protected outlineBlock(context: CanvasRenderingContext2D) {
		context.lineWidth = 1;
		context.strokeStyle = 'black';
		context.stroke();
	}

	protected fillBlock(color: string, context: CanvasRenderingContext2D) {
		context.fillStyle = color;
		context.fill();
	}

}

/**
 * Represents a block that takes place at the field
 */
export class FieldBlock extends AbstractBlock {

	public color: RGBColor;
	private realX: number;
	private realY: number;

	constructor(x: number, y: number) {
		super(x, y);
		this.calculateRealX();
		this.calculateRealY();
	}

	public getColor(): RGBColor {
		return this.color;
	}

	public moveDown() {
		this.y++;
		this.calculateRealY();
	}

	public getFieldSectionX(): number {
		return this.x;
	}

	public getFieldSectionY(): number {
		return this.y;
	}

	public calculateRealX() {
		const process = GameProcess.getCurrentProcess();
		this.realX = process.field.getRealFieldX() + this.getFieldSectionX() * process.field.realSectionSize;
	}

	public calculateRealY() {
		const process = GameProcess.getCurrentProcess();
		this.realY = process.field.getRealFieldY() + this.getFieldSectionY() * process.field.realSectionSize;
	}

	public getRealX(): number {
		return this.realX;
	}

	public getRealY(): number {
		return this.realY;
	}

}

/**
 * Represents a block that is attached to a figure
 */
export class FigureBlock extends AbstractBlock {

	public figure: Figure;

	public getColor(): RGBColor {
		return this.figure.color;
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
			if(newSectionX == block.getFieldSectionX() && newSectionY == block.getFieldSectionY()) return MoveResult.BLOCK;
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
		return this.x + this.figure.sectionX;
	}

	public getSectionY(): number {
		return this.y + this.figure.sectionY;
	}

	public getShadowSectionY(): number {
		return this.y + this.figure.getShadowSectionY();
	}

	public getRealShadowY(): number {
		const process = GameProcess.getCurrentProcess();
		return process.field.getRealFieldY() + this.getShadowSectionY() * process.field.realSectionSize;
	}

	public checkRotation(): MoveResult {
		const field = GameProcess.getCurrentProcess().field;
		const rotatedFieldX = this.findRotatedRelativeX() + this.figure.sectionX;
		const rotatedFieldY = this.findRotatedRelativeY() + this.figure.sectionY;
		if(!field.isSectionInsideOrAbove(rotatedFieldX, rotatedFieldY)) return MoveResult.BOUNDARY;
		for(const field_block of field.blocks) {
			if(field_block.getFieldSectionX() == rotatedFieldX && field_block.getFieldSectionY() == rotatedFieldY) 
			return MoveResult.BLOCK;
		}
		return MoveResult.ALLOW;
	}

	public findRotatedRelativeX(): number {
		const originY = this.y - this.figure.rotationCenterY;
		const rotatedOriginX = -originY;
		return rotatedOriginX + this.figure.rotationCenterX;
	}

	public findRotatedRelativeY(): number {
		const originX = this.x - this.figure.rotationCenterX;
		const rotatedOriginY = originX;
		return rotatedOriginY + this.figure.rotationCenterY;
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
		return this.x * GameProcess.getCurrentProcess().field.realSectionSize + this.figure.getPreviewRealX();
	}

	public getPreviewRealY(): number {
		return this.y * GameProcess.getCurrentProcess().field.realSectionSize + this.figure.getPreviewRealY();
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