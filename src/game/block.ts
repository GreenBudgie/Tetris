import StateHandler from "../state/StateHandler.js";
import Processable from "../util/Processable.js";
import Colorizable, {Color} from "./color.js";
import Figure from "./figure.js";
import Tetris from "./tetris.js";

export abstract class AbstractBlock implements Colorizable, Processable {
	protected x: number;
	protected y: number;
	
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public update(delta: number): void {}

	public abstract getColor(): Color;

	/**
	 * Gets the real X section position of the current block on the screen
	 */
	public abstract getRealX(): number;

	/**
	 * Gets the real Y section position of the current block on the screen
	 */
	public abstract getRealY(): number;

	public draw(context: CanvasRenderingContext2D) {
		const block_start_x = this.getRealX() + 0.5;
		const block_start_y = this.getRealY() + 0.5;
		this.prepareContextPath(block_start_x, block_start_y, context);
		this.fillBlock(this.getColor(), context);
		this.outlineBlock(context);
	}

	protected prepareContextPath(start_x: number, start_y: number, context: CanvasRenderingContext2D) {
		const section_size = StateHandler.getHandler().GAME.level.field.real_section_size;
		context.beginPath();
		context.moveTo(start_x, start_y);
		context.lineTo(start_x + section_size, start_y);
		context.lineTo(start_x + section_size, start_y + section_size);
		context.lineTo(start_x, start_y + section_size);
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

	public color: Color;
	private realX: number;
	private realY: number;

	constructor(x: number, y: number) {
		super(x, y);
		this.calculateRealX();
		this.calculateRealY();
	}

	public getColor(): Color {
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
		const level = StateHandler.getHandler().GAME.level;
		this.realX = level.field.getRealFieldX() + this.getFieldSectionX() * level.field.real_section_size;
	}

	public calculateRealY() {
		const level = StateHandler.getHandler().GAME.level;
		this.realY = level.field.getRealFieldY() + this.getFieldSectionY() * level.field.real_section_size;
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

	public getColor(): Color {
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
		const field = StateHandler.getHandler().GAME.level.field;
		const new_section_x = this.getSectionX() + dx;
		const new_section_y = this.getSectionY() + dy;
		for(const block of field.blocks) {
			if(new_section_x == block.getFieldSectionX() && new_section_y == block.getFieldSectionY()) return MoveResult.BLOCK;
		}
		if(field.isSectionInside(new_section_x, new_section_y)) return MoveResult.ALLOW;
		return MoveResult.BOUNDARY;
	}

	public getRealX(): number {
		const level = StateHandler.getHandler().GAME.level;
		return this.getSectionX() * level.field.real_section_size + level.field.getRealFieldX();
	}

	public getRealY(): number {
		const level = StateHandler.getHandler().GAME.level;
		return this.getSectionY() * level.field.real_section_size + level.field.getRealFieldY();
	}

	public getSectionX(): number {
		return this.x + this.figure.section_x;
	}

	public getSectionY(): number {
		return this.y + this.figure.section_y;
	}

	public getShadowSectionY(): number {
		return this.y + this.figure.getShadowSectionY();
	}

	public getRealShadowY(): number {
		const level = StateHandler.getHandler().GAME.level;
		return level.field.getRealFieldY() + this.getShadowSectionY() * level.field.real_section_size;
	}

	public checkRotation(): MoveResult {
		const field = StateHandler.getHandler().GAME.level.field;
		const rotated_field_x = this.findRotatedRelativeX() + this.figure.section_x;
		const rotated_field_y = this.findRotatedRelativeY() + this.figure.section_y;
		if(!field.isSectionInside(rotated_field_x, rotated_field_y)) return MoveResult.BOUNDARY;
		for(const field_block of field.blocks) {
			if(field_block.getFieldSectionX() == rotated_field_x && field_block.getFieldSectionY() == rotated_field_y) 
			return MoveResult.BLOCK;
		}
		return MoveResult.ALLOW;
	}

	public findRotatedRelativeX(): number {
		const origin_y = this.y - this.figure.rotation_center_y;
		const rotated_origin_x = -origin_y;
		return rotated_origin_x + this.figure.rotation_center_x;
	}

	public findRotatedRelativeY(): number {
		const origin_x = this.x - this.figure.rotation_center_x;
		const rotated_origin_y = origin_x;
		return rotated_origin_y + this.figure.rotation_center_y;
	}

	public rotateNoRestrictions() {
		const rotated_x = this.findRotatedRelativeX();
		const rotated_y = this.findRotatedRelativeY();
		this.x = rotated_x;
		this.y = rotated_y;
	}

	public getRelativeX(): number {
		return this.x;
	}

	public getRelativeY(): number {
		return this.y;
	}

	public getPreviewRealX(): number {
		return this.x * StateHandler.getHandler().GAME.level.field.real_section_size + this.figure.getPreviewRealX();
	}

	public getPreviewRealY(): number {
		return this.y * StateHandler.getHandler().GAME.level.field.real_section_size + this.figure.getPreviewRealY();
	}

	/**
	 * Creates a field block with the same coordinates and color
	 * @returns A new field block
	 */
	public toFieldBlock(): FieldBlock {
		const field_block = new FieldBlock(this.getSectionX(), this.getSectionY());
		field_block.color = this.getColor();
		return field_block;
	}

	public drawAsPreview(context: CanvasRenderingContext2D) {
		const startX = this.getPreviewRealX() + 0.5;
		const startY = this.getPreviewRealY() + 0.5;
		this.prepareContextPath(startX, startY, context);
		this.fillBlock(this.getColor(), context);
		this.outlineBlock(context);
	}

	public override draw(context: CanvasRenderingContext2D) {
		super.draw(context);
	}

	public drawShadow(context: CanvasRenderingContext2D) {
		const shadow_section_y = this.getShadowSectionY();
		const current_section_y = this.getSectionY();
		if(shadow_section_y != current_section_y) {
			const shadow_real_x = this.getRealX() + 0.5;
			const shadow_real_y = this.getRealShadowY() + 0.5;
			this.prepareContextPath(shadow_real_x, shadow_real_y, context);
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