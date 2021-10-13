import Tetris from "./tetris.js";

/**
 * A block is either a part of a figure attached to other parts, or a fallen block that fills up the field.
 * The block has coordinates relative to a figure.
 */
 export default class Block {
  public x: number;
  public y: number;
  public color: BlockColor;

  constructor(x: number, y: number, color?: BlockColor) {
    this.x = x;
    this.y = y;
    if(color == null) {
      this.selectRandomColor();
    } else {
      this.color = color;
    }
  }

  private selectRandomColor() {
    let colors: BlockColor[] = [];
    for(let blockColor in BlockColor) {
      colors.push(BlockColor[blockColor]);
    }
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  public draw() {
    const context = Tetris.context;
    const section_size = Tetris.field.real_section_size;
    const start_x = Tetris.field.getRealFieldX() + this.x * section_size + 0.5;
    const start_y = Tetris.field.getRealFieldY() + this.y * section_size + 0.5;
    context.beginPath();
    context.moveTo(start_x, start_y);
    context.lineTo(start_x + section_size, start_y);
    context.lineTo(start_x + section_size, start_y + section_size);
    context.lineTo(start_x, start_y + section_size);
    context.closePath();
    context.lineWidth = 1;
    context.strokeStyle = 'black';
    context.fillStyle = this.color;
    context.stroke();
    context.fill();
  }

}

export enum BlockColor {
  RED = "rgb(255, 86, 86)",
  GREEN = "rgb(132, 255, 92)",
  BLUE = "rgb(73, 63, 251)",
  PINK = "rgb(254, 102, 255)",
  YELLOW = "rgb(255, 251, 97)",
  ORANGE = "rgb(255, 151, 70)"
}