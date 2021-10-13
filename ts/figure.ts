import Block, { MoveResult } from "./block.js";
import Field from "./field.js";
import Tetris from "./tetris.js";

/**
 * A figure is a collection of blocks.
 */
export class Figure {
  private blocks: Block[];
  
  /**
   * Creates a figure based on section coordinates.
   * 0, 0 represents the top-left corner of the figure.
   * @param sections An array of tuples in which the first element is relative section x, the second is relative section y coordinate
   * @returns A figure with currently defined blocks
   */
  public static createByRelativeBlockSections(...sections: [number, number][]): Figure {
    const blocks: Block[] = [];
    for(let section of sections) {
      blocks.push(new Block(section[0], section[1]));
    }
    return new Figure(...blocks);
  }

  constructor(...blocks: Block[]) {
    this.blocks = blocks;
  }

  public moveRight() {
    this.move(1, 0);
  }

  public moveLeft() {
    this.move(-1, 0);
  }

  public fall() {
    this.move(0, 1);
  }

  public move(dx: number, dy: number): void {
    for(let block of this.blocks) {
      block.move(block.section_x + dx, block.section_y + dy);
    }
  }

  public draw() {
    for(let block of this.blocks) {
      block.draw();
    }
  }

}