import Block from "./block.js";

export default class Field {

  public readonly sections_x: number = 8;
  public readonly sections_y: number = 12;
  public readonly section_size_pixels: number = 48;

  private blocks: Block[];

  public getRealCanvasWidth(): number {
    return this.section_size_pixels * this.sections_x;
  }

  public getRealCanvasHeight(): number {
    return this.section_size_pixels * this.sections_y;
  }

  public draw(context: CanvasRenderingContext2D): void {
    context.clearRect
    this.drawSections(context);
    this.drawBlocks(context);
  }

  private drawSections(context: CanvasRenderingContext2D): void {

  }

  private drawBlocks(context: CanvasRenderingContext2D): void {

  }

}