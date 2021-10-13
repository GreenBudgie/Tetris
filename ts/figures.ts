import Block from "./block.js";
import Field from "./field.js";

/**
 * A figure is a collection of parts.
 * Figure has its own section position (x and y), and all parts has coordinates relative to this section
 */
export class Figure {
  private x: number;
  private y: number;
  private block: Block[]
  private field: Field;
  
  public Figure(field: Field, ...blocks: Block[]) {
    this.field = field;
    this.block = blocks;
  }

  /**
   * Moves the figure in any direction by the given deltas if possible.
   * If the figure ends up being outside the field or hits another figure it moves by the maximum amount of sections and stops.
   * @param dx Amount of sections to move the figure by x axis, may be negative
   * @param dy Amount of sections to move the figure by y axis, may be negative
   */
  public move(dx: number, dy: number): void {
    
  }

  /**
   * Gets the section of the given figure part
   * @param part The given part
   * @returns Absoulte part section coordinates, x and y
   */
  public getPartAbsoluteSection(block: Block): {x: number, y: number} {
    return {x: this.x + block.x, y: this.y + block.y};
  }

  /**
   * Checks whether this figure is currently outside the field
   */
  public isOutside(): boolean {
    return true;
  }

}