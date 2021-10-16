import Tetris from "./tetris.js";

/**
 * A block is either a part of a figure attached to other parts, or a fallen block that fills up the field.
 * The block has coordinates relative to a figure.
 */
export default class Block {
	public section_x: number;
	public section_y: number;
	public color: BlockColor;

	constructor(section_x: number, section_y: number, color?: BlockColor) {
		this.section_x = section_x;
		this.section_y = section_y;
		if(color == null) {
			this.selectRandomColor();
		} else {
			this.color = color;
		}
	}

	private selectRandomColor() {
		let colors: BlockColor[] = [];
		for(let blockColor in BlockColor) {
			colors.push(BlockColor[blockColor]);
		}
		this.color = colors[Math.floor(Math.random() * colors.length)];
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
		const new_section_x = this.section_x + dx;
		const new_section_y = this.section_y + dy;
		for(let block of Tetris.instance.field.blocks) {
			if(new_section_x == block.section_x && new_section_y == block.section_y) return MoveResult.BLOCK;
		}
		if(Tetris.instance.field.isSectionInsideOrAbove(new_section_x, new_section_y)) return MoveResult.ALLOW;
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
		const start_x = Tetris.instance.field.getRealFieldX() + this.section_x * section_size + 0.5;
		const start_y = Tetris.instance.field.getRealFieldY() + this.section_y * section_size + 0.5;
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

export enum BlockColor {
	RED = "rgb(255, 86, 86)",
	GREEN = "rgb(132, 255, 92)",
	BLUE = "rgb(73, 63, 251)",
	PINK = "rgb(254, 102, 255)",
	YELLOW = "rgb(255, 251, 97)",
	ORANGE = "rgb(255, 151, 70)"
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