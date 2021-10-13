/**
 * A block is either a part of a figure attached to other parts, or a fallen block that fills up the field.
 * The block has coordinates relative to a figure.
 * 
 */
 export default class Block {
  public x: number;
  public y: number;
  public color: BlockColor;

  public Block(x: number, y: number, color?: BlockColor) {
    this.x = x;
    this.y = y;
    if(color == null) {
      this.selectRandomColor();
    } else {
      this.color = color;
    }
  }

  private selectRandomColor(): void {
    let colors: BlockColor[];
    for(let blockColor in BlockColor) {
      colors.push(BlockColor[blockColor]);
    }
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
}

export enum BlockColor {
  RED = "black",
  GREEN = "green",
  BLUE = "blue",
  PINK = "pink",
  YELLOW = "yellow",
  ORANGE = "orange"
}