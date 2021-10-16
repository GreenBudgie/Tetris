import Block, {MoveResult} from "./block.js";
import InputHandler, {KeyBindings} from "./input_handler.js";
import Tetris from "./tetris.js";

/**
 * A figure is a collection of single blocks.
 * The figure itself does not contain a location, the blocks do. 
 */
export default class Figure {
	private _blocks: Block[];
	private falling: boolean;
	private readonly max_falling_time: number = 45;
	private falling_timer: number = this.max_falling_time;
	private color: FigureColor;

	/**
	 * Creates a figure based on section coordinates.
	 * 0, 0 represents the top-left corner of the figure.
	 * @param sections An array of tuples in which the first element is relative section x, the second is relative section y coordinate
	 * @example An input "[0, 0], [1, 0], [2, 0], [1, 1]" will create a T-shaped figure
	 * @returns A figure with currently defined blocks
	 */
	public static createByRelativeBlockSections(...sections: [number, number][]): Figure {
		const blocks: Block[] = [];
		for(let section of sections) {
			blocks.push(new Block(section[0], section[1]));
		}
		return new Figure(...blocks);
	}

	constructor(...blocks: Block[]) {
		this._blocks = blocks;
		this.selectRandomColor();
	}

	get blocks() {
		return this._blocks;
	}

	/**
	 * Gets absolute section positions with uttermost blocks with respect to figure rotation.
	 * This method uses raw section coordinates, so the boundaries might be shifted to a float value. 
	 * @returns An object containing absolute section positions with uttermost blocks
	 */
	public getBoundaries(): {left: number, top: number, right: number, bottom: number}  {
		let minBlockX = 999;
		let maxBlockX = 0;
		let minBlockY = 999;
		let maxBlockY = 0;
		for(const block of this._blocks) {
			if(block.getRawSectionX() > maxBlockX) maxBlockX = block.getRawSectionX();
			if(block.getRawSectionX() < minBlockX) minBlockX = block.getRawSectionX();
			if(block.getRawSectionY() > maxBlockY) maxBlockY = block.getRawSectionY();
			if(block.getRawSectionY() < minBlockY) minBlockY = block.getRawSectionY();
		}
		return {
			left: minBlockX,
			top: minBlockY,
			right: maxBlockX,
			bottom: maxBlockY
		};
	}

	/**
	 * Gets the current width with respect to figure rotation
	 * @returns The width of the figure
	 */
	public getWidth(): number {
		const boundaries = this.getBoundaries();
		return boundaries.right - boundaries.left + 1;
	}

	/**
	 * Gets the current height with respect to figure rotation
	 * @returns The height of the figure
	 */
	 public getHeight(): number {
		const boundaries = this.getBoundaries();
		return boundaries.bottom - boundaries.top + 1;
	}

	private selectRandomColor() {
		let colors: FigureColor[] = [];
		for(const figureColor in FigureColor) {
			colors.push(FigureColor[figureColor]);
		}
		this.color = colors[Math.floor(Math.random() * colors.length)];
		this._blocks.forEach(block => block.color = this.color);
	}

	public rotate() {
		const boundaries = this.getBoundaries();
		const center_x = (boundaries.left + boundaries.right) / 2;
		const center_y = (boundaries.bottom + boundaries.top) / 2;
		for(const block of this._blocks) {
			const origin_x = block.getRawSectionX() - center_x;
			const origin_y = block.getRawSectionY() - center_y;

			const rotated_origin_x = -origin_y;
			const rotated_origin_y = origin_x;

			block.setSectionX(rotated_origin_x + center_x);
			block.setSectionY(rotated_origin_y + center_y);
		}
	}

	public moveRight() {
		this.moveIfPossibleOrStop(1, 0);
	}

	public moveLeft() {
		this.moveIfPossibleOrStop(-1, 0);
	}

	public moveDownOrStop() {
		this.falling_timer = this.max_falling_time;
		this.moveIfPossibleOrStop(0, 1);
	}

	/**
	 * Moves all blocks of the figure by the specified deltas.
	 * Vertical movement obstruction will interrupt figure falling.
	 * Horizontal movement obstruction will not interrupt the falling, but the figure won't be moved.
	 * @param dx X movement, from -1 to 1
	 * @param dy Y movement, from -1 to 1
	 */
	public moveIfPossibleOrStop(dx: number, dy: number) {
		const isVerticalMovement = dy > 0;
		for(const block of this._blocks) {
			const moveResult = block.checkMove(dx, dy);
			if(moveResult != MoveResult.ALLOW) {
				if(isVerticalMovement) this.land();
				return;
			}
		}
		this.moveNoRestrictions(dx, dy);
	}

	/**
	 * Moves all blocks of the figure by the specified deltas ignoring movement restrictions.
	 * @param dx X movement
	 * @param dy Y movement
	 */
	public moveNoRestrictions(dx: number, dy: number) {
		for(const block of this._blocks) {
			block.move(dx, dy);
		}
	}

	/**
	 * Interrupts the falling
	 */
	public land() {
		Tetris.instance.field.landFigure();
	}

	public update(delta: number) {
		this.movementHandle();
		this.falling_timer -= delta * Tetris.FPS;
		if(this.falling_timer <= 0) {
			this.moveDownOrStop();
			this.falling_timer = this.max_falling_time;
		}
	}

	private movementHandle() {
		const handler = InputHandler.getHandler();
		if(handler.isKeyBindingPressedOrRepeats(KeyBindings.FIGURE_MOVE_LEFT)) {
			this.moveLeft();
		}
		if(handler.isKeyBindingPressedOrRepeats(KeyBindings.FIGURE_MOVE_RIGHT)) {
			this.moveRight();
		}
		if(handler.isKeyBindingPressedOrRepeats(KeyBindings.FIGURE_MOVE_DOWN)) {
			this.moveDownOrStop();
		}
		if(handler.isKeyBindingPressedOrRepeats(KeyBindings.FIGURE_ROTATE)) {
			this.rotate();
		}
	}

	public draw() {
		for(let block of this._blocks) {
			block.draw();
		}
	}

}

export enum FigureColor {
	RED = "rgb(255, 86, 86)",
	GREEN = "rgb(132, 255, 92)",
	BLUE = "rgb(73, 63, 251)",
	PINK = "rgb(254, 102, 255)",
	YELLOW = "rgb(255, 251, 97)",
	ORANGE = "rgb(255, 151, 70)"
}

export class Figures {

	public static shapes: [number, number][][] = [];

	public static readonly T_SHAPE = Figures.register([0, 0], [1, 0], [2, 0], [1, 1]);
	public static readonly BOX_SHAPE = Figures.register([0, 0], [1, 0], [0, 1], [1, 1]);
	public static readonly L_SHAPE = Figures.register([0, 0], [1, 0], [2, 0], [2, 1]);
	public static readonly I_SHAPE = Figures.register([0, 0], [1, 0], [2, 0], [3, 0]);
	public static readonly Z_SHAPE = Figures.register([0, 0], [1, 0], [1, 1], [2, 1]);
	public static readonly CORNER_SHAPE = Figures.register([0, 0], [1, 0], [1, 1]);

	private static register(...shape: [number, number][]): [number, number][] {
		Figures.shapes.push(shape);
		return shape;
	}

	public static createRandomFigure(): Figure {
		return Figure.createByRelativeBlockSections(...Figures.shapes[Math.floor(Math.random() * Figures.shapes.length)]);
	}

}