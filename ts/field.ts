import Block from "./block.js";
import Tetris from "./tetris.js";

export default class Field {

  public readonly sections_x: number = 14;
  public readonly sections_y: number = 20;
  public readonly section_size_pixels: number = 28;

  private blocks: Block[];

  public getRealFieldWidth(): number {
    return this.section_size_pixels * this.sections_x;
  }

  public getRealFieldHeight(): number {
    return this.section_size_pixels * this.sections_y;
  }

  public draw(): void {
    const context = Tetris.getTetris().getContext();
    this.drawSections(context);
    this.drawBlocks(context);
  }

  private drawSections(context: CanvasRenderingContext2D): void {
    context.beginPath();
    for(let x_section: number = 0; x_section <= this.sections_x; x_section++) {
      context.moveTo(x_section * this.section_size_pixels, 0);
      context.lineTo(x_section * this.section_size_pixels, this.getRealFieldHeight());
    }
    for(let y_section: number = 0; y_section <= this.sections_y; y_section++) {
      context.moveTo(0, y_section * this.section_size_pixels);
      context.lineTo(this.getRealFieldWidth(), y_section * this.section_size_pixels);
    }
    context.closePath();
    context.stroke();
  }

  private drawBlocks(context: CanvasRenderingContext2D): void {

  }

}