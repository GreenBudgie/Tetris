import Block, { BlockColor } from "./block.js";
import Tetris from "./tetris.js";

/**
 * A field is a game element that stores and renders all the blocks and figures inside it
 */
export default class Field {

  public readonly sections_x: number = 12;
  public readonly sections_y: number = 20;
  public readonly real_section_size: number = 28;

  public readonly blocks: Block[] = [];

  constructor() {
    this.blocks.push(new Block(1, 1));
    this.blocks.push(new Block(5, 7));
  }

  public getRealFieldX() {
    return Tetris.window_width / 2 - Tetris.field.getRealFieldWidth() / 2;
  }

  public getRealFieldY() {
    return Tetris.window_height / 2 - Tetris.field.getRealFieldHeight() / 2;
  }

  public getRealFieldWidth(): number {
    return this.real_section_size * this.sections_x;
  }

  public getRealFieldHeight(): number {
    return this.real_section_size * this.sections_y;
  }

  public isSectionInside(section_x: number, section_y: number): boolean {
    return section_x >= 0 && section_x <= this.sections_x && section_y >= 0 && section_y <= this.sections_y;
  }

  public draw() {
    this.drawSections();
    this.drawBlocks();
  }

  private drawSections() {
    const context = Tetris.context;
    const start_x = this.getRealFieldX();
    const start_y = this.getRealFieldY();
    context.strokeStyle = 'rgb(189, 189, 189)';
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
    for(let block of this.blocks) {
      block.draw();
    }
  }

}