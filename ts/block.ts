import Tetris from "./tetris.js";

/**
 * A block is either a part of a figure attached to other parts, or a fallen block that fills up the field.
 * The block has coordinates relative to a figure.
 */
 export default class Block {
  public section_x: number;
  public section_y: number;
  public color: BlockColor;

  constructor(section_x: number, section_y: number, color?: BlockColor) {
    this.section_x = section_x;
    this.section_y = section_y;
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

  /**
   * Checks whether the block is able to move right
   * @returns ALLOW if the block is able to move right, BOUNDARY if a wall obstructs the movement, BLOCK if a block obstructs the movement
   */
  public checkMoveRight(): MoveResult {
    return this.checkMove(this.section_x + 1, this.section_y);
  }

  /**
   * Checks whether the block is able to move left
   * @returns ALLOW if the block is able to move left, BOUNDARY if a wall obstructs the movement, BLOCK if a block obstructs the movement
   */
  public checkMoveLeft(): MoveResult {
    return this.checkMove(this.section_x - 1, this.section_y);
  }

  /**
   * Checks whether the block is able to move down
   * @returns ALLOW if the block is able to move down, BOUNDARY if a floor obstructs the movement, BLOCK if a block obstructs the movement
   */
  public checkMoveDown(): MoveResult {
    return this.checkMove(this.section_x, this.section_y + 1);
  }

  /**
   * Checks whether the block is able to move to the specified section
   * @returns ALLOW if the block is able to move to the section, BOUNDARY if a floor obstructs the movement, BLOCK if a block obstructs the movement
   */
  public checkMove(new_section_x: number, new_section_y: number): MoveResult {
    for(let block of Tetris.field.blocks) {
      if(new_section_x == block.section_x && new_section_y == block.section_y) return MoveResult.BLOCK;
    }
    if(Tetris.field.isSectionInside(new_section_x, new_section_y)) return MoveResult.ALLOW;
    return MoveResult.BOUNDARY; 
  }

  public moveRight() {
    this.move(this.section_x + 1, this.section_y);
  }

  public moveLeft() {
    this.move(this.section_x - 1, this.section_y);
  }

  public fall() {
    this.move(this.section_x, this.section_y + 1);
  }

  /**
   * Moves the block regardless of movement restrictions.
   * This method must only be called after the movement checks.
   * @param new_section_x The x section coordinate to move the block into
   * @param new_section_y The y section coordinate to move the block into
   */
  public move(new_section_x: number, new_section_y: number) {
    this.section_x = new_section_x;
    this.section_y = new_section_y;
  }

  public draw() {
    const context = Tetris.context;
    const section_size = Tetris.field.real_section_size;
    const start_x = Tetris.field.getRealFieldX() + this.section_x * section_size + 0.5;
    const start_y = Tetris.field.getRealFieldY() + this.section_y * section_size + 0.5;
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

export enum MoveResult {
  /**
   * Block is able to move
   */
  ALLOW,
  /**
   * Movement is obstructed by a wall or a floor
   */
  BOUNDARY,
  /**
   * Movement is obstucted by another block
   */
  BLOCK
}