import Block from "./block.js";
import Figure from "./figure.js";
import Tetris from "./tetris.js";

/**
 * A field is a game element that stores and renders all the blocks and figures inside it
 */
export default class Field {

	/**
	 * Determines how wide in terms of sections the field is
	 */
	public readonly sections_x: number = 12;
	/**
	 * Determines how deep in terms of sections the field is
	 */
	public readonly sections_y: number = 20;
	/**
	 * The actual size of each section measured in pixels
	 */
	public readonly real_section_size: number = 28;
	/**
	 * The amount of sections above the playable area
	 */
	public readonly limit_sections = 3;

	public readonly blocks: Block[] = [];
	public fallingFigure: Figure;

	constructor() {
		this.createFallingFigure(Figure.createByRelativeBlockSections([0, 0], [1, 0], [0, 1]));
	}

	public getRealFieldX() {
		return Math.round(Tetris.instance.window_width / 2 - Tetris.instance.field.getRealFieldWidth() / 2);
	}

	public getRealFieldY() {
		return Math.round(Tetris.instance.window_height / 2 - Tetris.instance.field.getRealFieldHeight() / 2);
	}

	public getRealFieldWidth(): number {
		return this.real_section_size * this.sections_x;
	}

	public getRealFieldHeight(): number {
		return this.real_section_size * this.sections_y;
	}

	public createFallingFigure(figure: Figure) {
		const halfFigureWidth = Math.floor(figure.getCurrentWidth() / 2);
		const halfFieldWidth = Math.floor(this.sections_x / 2);
		figure.moveNoRestrictions(halfFieldWidth - halfFigureWidth, 0)
		this.fallingFigure = figure;
	}

	public isSectionInside(section_x: number, section_y: number): boolean {
		return section_x >= 0 && section_x < this.sections_x && section_y >= 0 && section_y < this.sections_y;
	}

	public isSectionInsideOrAbove(section_x: number, section_y: number): boolean {
		return section_x >= 0 && section_x < this.sections_x && section_y < this.sections_y;
	}

	public update(delta: number) {
		if(this.fallingFigure != null) this.fallingFigure.update(delta);
	}

	public draw() {
		this.drawSections();
		this.drawBlocks();
		if(this.fallingFigure != null) this.fallingFigure.draw();
	}

	private drawSections() {
		const context = Tetris.instance.context;
		const start_x = this.getRealFieldX();
		const start_y = this.getRealFieldY();
		context.strokeStyle = "rgb(189, 189, 189)";
		context.lineWidth = 1;
		context.beginPath();
		for(let x_section: number = 0; x_section <= this.sections_x; x_section++) {
			context.moveTo(start_x + x_section * this.real_section_size + 0.5, start_y);
			context.lineTo(start_x + x_section * this.real_section_size + 0.5, start_y + this.getRealFieldHeight());
		}
		for(let y_section: number = 0; y_section <= this.sections_y; y_section++) {
			context.moveTo(start_x, start_y + y_section * this.real_section_size + 0.5);
			context.lineTo(start_x + this.getRealFieldWidth(), start_y + y_section * this.real_section_size + 0.5);
		}
		context.closePath();
		context.stroke();
	}

	private drawBlocks() {
		this.blocks.forEach(block => block.draw());
	}

}