import {FigureColor} from "./figure.js";
import Tetris from "./tetris.js";

/**
 * A block is either a part of a figure attached to other parts, or a fallen block that fills up the field.
 * The block has coordinates relative to a figure.
 */
export default class Block {
	/**
	 * X section coordinate. Might not be an integer value due to figure rotation.
	 */
	private section_x: number;
	/**
	 * Y section coordinate. Might not be an integer value due to figure rotation.
	 */
	private section_y: number;
	public color: FigureColor = FigureColor.RED;

	constructor(section_x: number, section_y: number) {
		this.section_x = section_x;
		this.section_y = section_y;
	}

	/**
	 * Gets the raw value of X section position. This might not be an integer value. 
	 * @returns Raw X section position
	 */
	public getRawSectionX(): number {
		return this.section_x;
	}

	/**
	 * Gets the raw value of Y section position. This might not be an integer value. 
	 * @returns Raw Y section position
	 */
	public getRawSectionY(): number {
		return this.section_y;
	}

	/**
	 * Gets the real value of X section position (always an integer value).
	 * The block will be drawn inside this section.
	 * @returns Real X section position
	 */
	public getRealSectionX(): number {
		return Math.floor(this.section_x);
	}

	/**
	 * Gets the real value of Y section position (always an integer value).
	 * The block will be drawn inside this section.
	 * @returns Real Y section position
	 */
 	public getRealSectionY(): number {
		return Math.ceil(this.section_y);
	}

	public setSectionX(x: number) {
		this.section_x = x;
	}

	public setSectionY(y: number) {
		this.section_y = y;
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
		const new_section_x = this.getRealSectionX() + dx;
		const new_section_y = this.getRealSectionY() + dy;
		for(let block of Tetris.instance.field.blocks) {
			if(new_section_x == block.getRealSectionX() && new_section_y == block.getRealSectionY()) return MoveResult.BLOCK;
		}
		if(Tetris.instance.field.isSectionInside(new_section_x, new_section_y)) return MoveResult.ALLOW;
		return MoveResult.BOUNDARY;
	}

	public moveRight() {
		this.move(1, 0);
	}

	public moveLeft() {
		this.move(-1, 0);
	}

	public fall() {
		this.move(0, 1);
	}

	/**
	 * Moves the block regardless of movement restrictions.
	 * This method should be called after the movement checks.
	 * @param dx X movement
	 * @param dy Y movement
	 */
	public move(dx: number, dy: number) {
		this.section_x += dx;
		this.section_y += dy;
	}

	public draw() {
		const context = Tetris.instance.context;
		const section_size = Tetris.instance.field.real_section_size;
		const start_x = Tetris.instance.field.getRealFieldX() + this.getRealSectionX() * section_size + 0.5;
		const start_y = Tetris.instance.field.getRealFieldY() + this.getRealSectionY() * section_size + 0.5;
		context.beginPath();
		context.moveTo(start_x, start_y);
		context.lineTo(start_x + section_size, start_y);
		context.lineTo(start_x + section_size, start_y + section_size);
		context.lineTo(start_x, start_y + section_size);
		context.closePath();
		context.lineWidth = 1;
		context.strokeStyle = 'black';
		context.fillStyle = this.color;
		context.stroke();
		context.fill();
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