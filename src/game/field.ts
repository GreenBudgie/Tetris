import StateHandler from "../state/stateHandler.js";
import Processable from "../util/processable.js";
import {FieldBlock} from "./block.js";
import Figure, {Figures} from "./figure.js";
import Tetris from "../main/tetris.js";
import GameProcess from "./gameProcess.js";

/**
 * A field is a game element that stores and renders all the blocks and figures inside it
 */
export default class Field implements Processable {

	/**
	 * Determines how wide in terms of sections the field is
	 */
	public readonly sectionX: number;
	/**
	 * Determines how deep in terms of sections the field is
	 */
	public readonly sectionsY: number;
	/**
	 * The actual size of each section measured in pixels
	 */
	public readonly realSectionSize: number = 28;
	/**
	 * The amount of sections above the playable area
	 */
	public readonly limitSections = 3;

	public blocks: FieldBlock[] = [];
	public fallingFigure: Figure;
	private readonly maxTimeToCreateNewFigure = 15;
	private timeToCreateNewFigure = this.maxTimeToCreateNewFigure;

	public constructor(sectionsX: number, sectionsY: number) {
		this.sectionX = sectionsX;
		this.sectionsY = sectionsY;
		this.createFallingFigure(Figures.createRandomFigure());
	}

	public static defaultSizeField(): Field {
		return new Field(12, 20);
	}

	public getRealFieldX() {
		return Math.round(Tetris.instance.WINDOW_WIDTH / 2 - this.getRealFieldWidth() / 2);
	}

	public getRealFieldY() {
		return Math.round(Tetris.instance.WINDOW_HEIGHT / 2 - this.getRealFieldHeight() / 2);
	}

	public getRealFieldWidth(): number {
		return this.realSectionSize * this.sectionX;
	}

	public getRealFieldHeight(): number {
		return this.realSectionSize * this.sectionsY;
	}

	public createFallingFigure(figure: Figure) {
		const halfFigureWidth = Math.floor(figure.getCurrentWidth() / 2);
		const halfFieldWidth = Math.floor(this.sectionX / 2);
		figure.moveNoRestrictions(halfFieldWidth - halfFigureWidth, 0)
		this.fallingFigure = figure;
	}

	public landFigure() {
		for(const figureBlock of this.fallingFigure.blocks) {
			this.blocks.push(figureBlock.toFieldBlock());
		}
		this.fallingFigure = null;
		this.timeToCreateNewFigure = this.maxTimeToCreateNewFigure;
		this.removeFullRowsAndGrantPoints();
	}

	public removeFullRowsAndGrantPoints() {
		row_loop: 
		for(let y = 0; y < this.sectionsY; y++) {
			for(let x = 0; x < this.sectionX; x++) {
				const fieldBlock = this.getBlockAt(x, y);
				if(fieldBlock == null) {
					continue row_loop;
				}
			}
			const process = GameProcess.getCurrentProcess();
			process.points += this.sectionX;
			process.filledRows++;
			this.blocks = this.blocks.filter(block => block.getFieldSectionY() != y);
			for(const block of this.blocks) {
				if(block.getFieldSectionY() < y) block.moveDown();
			}
		}
	}

	public getBlockAt(sectionX: number, sectionY: number): FieldBlock | null {
		for(const block of this.blocks) {
			if(block.getFieldSectionX() == sectionX && block.getFieldSectionY() == sectionY) return block;
		}
		return null;
	}

	public isSectionInside(sectionX: number, sectionY: number): boolean {
		return sectionX >= 0 && sectionX < this.sectionX && sectionY >= 0 && sectionY < this.sectionsY;
	}

	public update(delta: number) {
		if(this.fallingFigure != null) {
			this.fallingFigure.update(delta);
		} else {
			this.timeToCreateNewFigure -= delta * Tetris.FPS;
			if(this.timeToCreateNewFigure <= 0) {
				const process = GameProcess.getCurrentProcess();
				process.createNextFigureAtField();
				process.selectNextFigure();
			}
		}
	}

	public draw(context: CanvasRenderingContext2D) {
		this.drawSections(context);
		this.drawBlocks(context);
		if(this.fallingFigure != null) this.fallingFigure.draw(context);
	}

	private drawSections(context: CanvasRenderingContext2D) {
		const startX = this.getRealFieldX();
		const startY = this.getRealFieldY();
		context.strokeStyle = "rgb(189, 189, 189)";
		context.lineWidth = 1;
		context.beginPath();
		for(let xSection: number = 0; xSection <= this.sectionX; xSection++) {
			context.moveTo(startX + xSection * this.realSectionSize + 0.5, startY);
			context.lineTo(startX + xSection * this.realSectionSize + 0.5, startY + this.getRealFieldHeight());
		}
		for(let ySection: number = 0; ySection <= this.sectionsY; ySection++) {
			context.moveTo(startX, startY + ySection * this.realSectionSize + 0.5);
			context.lineTo(startX + this.getRealFieldWidth(), startY + ySection * this.realSectionSize + 0.5);
		}
		context.closePath();
		context.stroke();
	}

	private drawBlocks(context: CanvasRenderingContext2D) {
		this.blocks.forEach(block => block.draw(context));
	}

}