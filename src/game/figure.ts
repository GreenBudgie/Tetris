import BlockColor from "../color/blockColor.js";
import Colorizable from "../color/colorizable.js";
import RGBColor from "../color/rgbColor.js";
import Processable from "../util/processable.js";
import {FigureBlock, MoveResult} from "./block.js";
import InputHandler, {KeyBindings} from "../main/inputHandler.js";
import Tetris from "../main/tetris.js";
import GameProcess from "./gameProcess.js";
import Point, {PointArray} from "../util/point.js";
import SpriteFigure from "../sprite/spriteFigure.js";

export default class Figure implements Colorizable, Processable {
	
	public readonly section: Point = Point.zero();
	public readonly rotationCenter: Point;

	private _blocks: FigureBlock[];

	private readonly maxFallingTime: number = 45;
	private fallingTimer: number = this.maxFallingTime;

	private previewSprite: SpriteFigure;

	public color: RGBColor;

	constructor(shape: Point[], rotationCenter: Point) {
		this.rotationCenter = rotationCenter;
		const blocks: FigureBlock[] = [];
		shape.forEach(point => blocks.push(new FigureBlock(point.clone())));
		this._blocks = blocks;
		this.color = BlockColor.getRandomColor();
		this._blocks.forEach(block => {
			block.figure = this;
		});

		this.previewSprite = new SpriteFigure(shape);
		this.previewSprite.blockSize = GameProcess.getCurrentProcess().field.realSectionSize;
		this.previewSprite.rotationCenter.setPositionTo(this.rotationCenter);
		this.previewSprite.outlineMode = "block";
		this.previewSprite.outlineWidth = 1;
		this.previewSprite.getColor().setTo(this.color);
		this.previewSprite.position.setPositionTo(this.getPreviewRealPosition());
	}

	public getPreviewRealPosition(): Point {
		const process = GameProcess.getCurrentProcess();
		const halfSectionSize = process.field.realSectionSize / 2;
		return process.getPreviewCenterPosition().moveBy(-this.getCurrentWidth() * halfSectionSize, -this.getCurrentHeight() * halfSectionSize);
	}

	public getColor(): RGBColor {
		return this.color;
	}

	public get blocks() {
		return this._blocks;
	}

	public getCurrentWidth(): number {
		let maxRelativeBlockX: number = 0;
		for(const block of this._blocks) {
			if(block.getRelativeSection().x > maxRelativeBlockX) maxRelativeBlockX = block.getRelativeSection().x;
		}
		return maxRelativeBlockX + 1;
	}

	public getCurrentHeight(): number {
		let maxRelativeBlockY: number = 0;
		for(const block of this._blocks) {
			if(block.getRelativeSection().y > maxRelativeBlockY) maxRelativeBlockY = block.getRelativeSection().y;
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

	private getRealPosition(): Point {
		const field = GameProcess.getCurrentProcess().field;
		return new Point(
			this.section.x * field.realSectionSize + field.getRealFieldPosition().x,
			this.section.y * field.realSectionSize + field.getRealFieldPosition().y
		);
	}

	/**
	 * Moves all blocks of the figure by the specified deltas ignoring movement restrictions.
	 * @param dx X movement
	 * @param dy Y movement
	 */
	public moveNoRestrictions(dx: number, dy: number) {
		this.section.moveBy(dx, dy);
		this._blocks.forEach(block => block.moveSpriteWithEffect());
	}

	/**
	 * Interrupts the falling
	 */
	public land() {
		GameProcess.getCurrentProcess().field.landFigure();
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

	public drawPreview(context: CanvasRenderingContext2D) {
		this.previewSprite.draw(context);
	}

	public draw(context: CanvasRenderingContext2D) {
		this._blocks.forEach(block => block.draw(context));
	}

	private needsToDrawShadow(): boolean {
		for(const currentBlock of this._blocks) {
			const shadowY = currentBlock.getShadowSection().y;
			for(const blockToCheck of this._blocks) {
				if(blockToCheck.getFieldSection().y >= shadowY) return false;
			}
		}
		return true;
	}

	public getShadowSection(): Point {
		for(let yShift = 1;; yShift++) {
			for(const block of this._blocks) {
				if(block.checkMove(0, yShift) != MoveResult.ALLOW) {
					return this.section.clone().moveBy(0, yShift - 1);
				}
			}
		}
	}

}

export class FigurePattern {

	private shape: Point[] = [];
	private centerOfRotation: Point;

	private maxX = 0;

	private constructor() {}

	public static builder(): FigurePattern {
		return new FigurePattern();
	}

	public block(relativeX: number, relativeY: number): FigurePattern {
		if(relativeX > this.maxX) this.maxX = relativeX;
		this.shape.push(new Point(relativeX, relativeY));
		return this;
	}

	public rotationCenter(relativeX: number, relativeY: number): FigurePattern {
		this.centerOfRotation = new Point(relativeX, relativeY);
		return this;
	}

	public createFigure(): Figure {
		const doFlip = Math.random() < 0.5;
		let finalShape: Point[] = this.shape.map(point => point.clone());
		if(doFlip) {
			finalShape.forEach(point => {
				point.x = this.maxX - point.x;
			});
		}
		const figure = new Figure(finalShape, this.centerOfRotation.clone());
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