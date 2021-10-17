import {FieldBlock} from "./block.js";
import Figure, {Figures} from "./figure.js";
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

	public readonly blocks: FieldBlock[] = [];
	public falling_figure: Figure;
	private readonly max_time_to_create_new_figure = 15;
	private time_to_create_new_figure = this.max_time_to_create_new_figure;

	constructor() {
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
		const half_figure_width = Math.floor(figure.getInitialWidth() / 2);
		const half_field_width = Math.floor(this.sections_x / 2);
		figure.moveNoRestrictions(half_field_width - half_figure_width, 0)
		this.falling_figure = figure;
	}

	public landFigure() {
		for(const figure_block of this.falling_figure.blocks) {
			this.blocks.push(figure_block.toFieldBlock());
		}
		this.falling_figure = null;
		this.time_to_create_new_figure = this.max_time_to_create_new_figure;
	}

	public isSectionInside(section_x: number, section_y: number): boolean {
		return section_x >= 0 && section_x < this.sections_x && section_y >= 0 && section_y < this.sections_y;
	}

	public update(delta: number) {
		if(this.falling_figure != null) {
			this.falling_figure.update(delta);
		} else {
			this.time_to_create_new_figure -= delta * Tetris.FPS;
			if(this.time_to_create_new_figure <= 0) {
				this.createFallingFigure(Figures.createRandomFigure());
			}
		}
	}

	public draw() {
		this.drawSections();
		this.drawBlocks();
		if(this.falling_figure != null) this.falling_figure.draw();
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