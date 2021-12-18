import Point from "../util/point.js";
import {FieldBlock} from "./fieldBlock.js";
import Figure from "./Figure.js";
import GameProcess from "./gameProcess.js";

/**
 * Represents a block that is attached to a figure
 */
export class FigureBlock {

	public readonly relativePosition: Point;
	public readonly figure: Figure;

	public constructor(relativePosition: Point, figure: Figure) {
		this.relativePosition = relativePosition;
		this.figure = figure;
	}

	public checkMoveRight(): MoveResult {
		return this.checkMove(1, 0);
	}

	public checkMoveLeft(): MoveResult {
		return this.checkMove(-1, 0);
	}

	public checkMoveDown(): MoveResult {
		return this.checkMove(0, 1);
	}

	/**
	 * Checks whether the block is able to move by specified deltas
	 * @returns ALLOW if the block is able to move by specified deltas, BOUNDARY if a floor obstructs the movement, BLOCK if a block obstructs the movement
	 */
	public checkMove(dx: number, dy: number): MoveResult {
		const field = GameProcess.getCurrentProcess().field;
		const newSection = this.getFieldSection().clone().moveBy(dx, dy);
		for(const block of field.blocks) {
			if(newSection.x == block.section.x && newSection.y == block.section.y) return MoveResult.BLOCK;
		}
		if(field.isSectionInside(newSection)) return MoveResult.ALLOW;
		return MoveResult.BOUNDARY;
	}

	public getFieldSection(): Point {
		return this.relativePosition.clone().add(this.figure.section);
	}

	public getRealPosition(): Point {
		const field = GameProcess.getCurrentProcess().field;
		return new Point(
			this.getFieldSection().x * field.realSectionSize + field.getRealFieldPosition().x,
			this.getFieldSection().y * field.realSectionSize + field.getRealFieldPosition().y
		);
	}

	public getShadowSection(): Point {
		return this.figure.getShadowSection().add(this.figure.section);
	}

	public getRealShadowPosition(): Point {
		const process = GameProcess.getCurrentProcess();
		return new Point(
			process.field.getRealFieldPosition().x + this.getShadowSection().x * process.field.realSectionSize,
			process.field.getRealFieldPosition().y + this.getShadowSection().y * process.field.realSectionSize
		);
	}

	public checkRotation(): MoveResult {
		const field = GameProcess.getCurrentProcess().field;
		const rotatedFieldSection = this.findRotatedRelativeSection().add(this.figure.section);
		if(!field.isSectionInsideOrAbove(rotatedFieldSection)) return MoveResult.BOUNDARY;
		for(const field_block of field.blocks) {
			if(field_block.section.equals(rotatedFieldSection)) return MoveResult.BLOCK;
		}
		return MoveResult.ALLOW;
	}

	public findRotatedRelativeSection(): Point {
		const origin = this.relativePosition.clone().subtract(this.figure.rotationCenter);
		const rotatedOrigin = new Point(-origin.y, origin.x);
		return rotatedOrigin.add(this.figure.rotationCenter);
	}

	public rotateNoRestrictions() {
		this.relativePosition.setPositionTo(this.findRotatedRelativeSection());
	}

	public getRelativeSection(): Point {
		return this.relativePosition;
	}

	/**
	 * Creates a field block with the same coordinates and color
	 * @returns A new field block
	 */
	public toFieldBlock(): FieldBlock {
		const fieldBlock = new FieldBlock(this.getFieldSection());
		fieldBlock.sprite.getColor().setTo(this.figure.sprite.getColor());
		return fieldBlock;
	}

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