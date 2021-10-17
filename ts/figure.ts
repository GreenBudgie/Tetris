import {FigureBlock, MoveResult} from "./block.js";
import Colorizable, {Color, getRandomColor} from "./color.js";
import InputHandler, {KeyBindings} from "./input_handler.js";
import Tetris from "./tetris.js";

/**
 * A figure is a collection of single blocks.
 * The figure itself does not contain a location, the blocks do. 
 */
export default class Figure implements Colorizable {
	
	public section_x: number = 0;
	public section_y: number = 0;

	public rotation_center_x: number;
	public rotation_center_y: number;

	private _blocks: FigureBlock[];

	private readonly max_falling_time: number = 45;
	private falling_timer: number = this.max_falling_time;

	public color: Color;

	/**
	 * Creates a figure based on section coordinates.
	 * 0, 0 represents the top-left corner of the figure.
	 * @param sections An array of tuples in which the first element is relative section x, the second is relative section y coordinate
	 * @example An input "[0, 0], [1, 0], [2, 0], [1, 1]" will create a T-shaped figure
	 * @returns A figure with currently defined blocks
	 */
	public static createByRelativeBlockSections(...sections: [number, number][]): Figure {
		const blocks: FigureBlock[] = [];
		for(let section of sections) {
			blocks.push(new FigureBlock(section[0], section[1]));
		}
		return new Figure(blocks);
	}

	constructor(blocks: FigureBlock[]) {
		blocks.forEach(block => block.figure = this);
		this._blocks = blocks;
		this.color = getRandomColor();
	}

	public getColor(): Color {
		return this.color;
	}

	get blocks() {
		return this._blocks;
	}

	public getInitialWidth(): number {
		let maxRelativeBlockX: number = 0;
		for(const block of this._blocks) {
			if(block.getFigureRelativeX() > maxRelativeBlockX) maxRelativeBlockX = block.getFigureRelativeX();
		}
		return maxRelativeBlockX;
	}

	public rotate() {
		for(const block of this._blocks) {
			if(block.checkRotation() != MoveResult.ALLOW) return;
		}
		this._blocks.forEach(block => block.rotateNoRestrictions());
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
	 * Moves the figure by the specified deltas.
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
		this.section_x += dx;
		this.section_y += dy;
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

export class FigurePattern {

	private shape: [number, number][] = [];
	private rotation_center: [number, number];

	private constructor() {}

	public static builder(): FigurePattern {
		return new FigurePattern();
	}

	public block(relative_x: number, relative_y: number): FigurePattern {
		this.shape.push([relative_x, relative_y]);
		return this;
	}

	public rotationCenter(relative_x: number, relative_y: number): FigurePattern {
		this.rotation_center = [relative_x, relative_y];
		return this;
	}

	public createFigure(): Figure {
		const figure = Figure.createByRelativeBlockSections(...this.shape);
		figure.rotation_center_x = this.rotation_center[0];
		figure.rotation_center_y = this.rotation_center[1];
		return figure;
	}

}

export class Figures {

	public static patterns: FigurePattern[] = [];

	public static readonly T_SHAPE = Figures.register(
		FigurePattern.builder().block(0, 0).block(1, 0).block(2, 0).block(1, 1).rotationCenter(1, 0));

	public static readonly BOX_SHAPE = Figures.register(
		FigurePattern.builder().block(0, 0).block(1, 0).block(0, 1).block(1, 1).rotationCenter(0.5, 0.5));

	public static readonly L_SHAPE = Figures.register(
		FigurePattern.builder().block(0, 0).block(1, 0).block(2, 0).block(2, 1).rotationCenter(1, 0));

	public static readonly I_SHAPE = Figures.register(
		FigurePattern.builder().block(0, 0).block(1, 0).block(2, 0).block(3, 0).rotationCenter(1.5, 0.5));

	public static readonly Z_SHAPE = Figures.register(
		FigurePattern.builder().block(0, 0).block(1, 0).block(1, 1).block(2, 1).rotationCenter(1, 0));

	public static readonly CORNER_SHAPE = Figures.register(
		FigurePattern.builder().block(0, 0).block(1, 0).block(1, 1).rotationCenter(0.5, 0.5));

	private static register(pattern: FigurePattern): FigurePattern {
		Figures.patterns.push(pattern);
		return pattern;
	}

	public static createRandomFigure(): Figure {
		return Figures.patterns[Math.floor(Math.random() * Figures.patterns.length)].createFigure();
	}

}