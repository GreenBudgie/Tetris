import BlockColor from "../color/blockColor.js";
import Colorizable from "../color/colorizable.js";
import RGBColor from "../color/rgbColor.js";
import StateHandler from "../state/stateHandler.js";
import Processable from "../util/processable.js";
import {FigureBlock, MoveResult} from "./block.js";
import InputHandler, {KeyBindings} from "../main/inputHandler.js";
import Tetris from "../main/tetris.js";

/**
 * A figure is a collection of single blocks
 */
export default class Figure implements Colorizable, Processable {
	
	public sectionX: number = 0;
	public sectionY: number = 0;

	public rotationCenterX: number;
	public rotationCenterY: number;

	private _blocks: FigureBlock[];

	private readonly maxFallingTime: number = 45;
	private fallingTimer: number = this.maxFallingTime;

	public color: RGBColor;

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
		this._blocks = blocks;
		this.color = BlockColor.getRandomColor();
		this._blocks.forEach(block => {
			block.figure = this;
		});
	}

	public getPreviewRealX() {
		const level = StateHandler.getHandler().GAME.level;
		return level.getLeftSideMiddle() - (this.getCurrentWidth() * level.field.realSectionSize) / 2;
	}

	public getPreviewRealY() {
		return StateHandler.getHandler().GAME.level.field.getRealFieldY() + 60;
	}

	public getColor(): RGBColor {
		return this.color;
	}

	get blocks() {
		return this._blocks;
	}

	public getCurrentWidth(): number {
		let maxRelativeBlockX: number = 0;
		for(const block of this._blocks) {
			if(block.getRelativeX() > maxRelativeBlockX) maxRelativeBlockX = block.getRelativeX();
		}
		return maxRelativeBlockX + 1;
	}

	public getCurrentHeight(): number {
		let maxRelativeBlockY: number = 0;
		for(const block of this._blocks) {
			if(block.getRelativeY() > maxRelativeBlockY) maxRelativeBlockY = block.getRelativeY();
		}
		return maxRelativeBlockY + 1;
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
		this.fallingTimer = this.maxFallingTime;
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
		this.sectionX += dx;
		this.sectionY += dy;
	}

	/**
	 * Interrupts the falling
	 */
	public land() {
		StateHandler.getHandler().GAME.level.field.landFigure();
	}

	public update(delta: number) {
		this.movementHandle();
		this.fallingTimer -= delta * Tetris.FPS;
		if(this.fallingTimer <= 0) {
			this.moveDownOrStop();
			this.fallingTimer = this.maxFallingTime;
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

	public drawAsPreview(context: CanvasRenderingContext2D) {
		for(const block of this._blocks) {
			block.drawAsPreview(context);
		}
	}

	public draw(context: CanvasRenderingContext2D) {
		const drawShadow = this.needsToDrawShadow();
		for(const block of this._blocks) {
			block.draw(context);
			if(drawShadow) {
				block.drawShadow(context);
			}
		}
	}

	private needsToDrawShadow(): boolean {
		for(const currentBlock of this._blocks) {
			const shadowY = currentBlock.getShadowSectionY();
			for(const blockToCheck of this._blocks) {
				if(blockToCheck.getSectionY() >= shadowY) return false;
			}
		}
		return true;
	}

	public getShadowSectionY(): number {
		for(let yShift = 1;; yShift++) {
			for(const block of this._blocks) {
				if(block.checkMove(0, yShift) != MoveResult.ALLOW) {
					return this.sectionY + yShift - 1;
				}
			}
		}
	}

}

export class FigurePattern {

	private shape: [number, number][] = [];
	private centerOfRotation: [number, number];

	private maxX = 0;

	private constructor() {}

	public static builder(): FigurePattern {
		return new FigurePattern();
	}

	public block(relative_x: number, relative_y: number): FigurePattern {
		if(relative_x > this.maxX) this.maxX = relative_x;
		this.shape.push([relative_x, relative_y]);
		return this;
	}

	public rotationCenter(relative_x: number, relative_y: number): FigurePattern {
		this.centerOfRotation = [relative_x, relative_y];
		return this;
	}

	public createFigure(): Figure {
		const doFlip = Math.random() < 0.5;
		let finalShape: [number, number][] = [];
		this.shape.forEach((coords) => {
			finalShape.push([coords[0], coords[1]]);
		});
		if(doFlip) {
			finalShape.forEach((coords) => {
				coords[0] = this.maxX - coords[0];
			});
		}
		const figure = Figure.createByRelativeBlockSections(...finalShape);
		figure.rotationCenterX = this.centerOfRotation[0];
		figure.rotationCenterY = this.centerOfRotation[1];
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