import {easeInOutQuad, easeOutQuad} from "../effect/effectEasings.js";
import MoveEffect from "../effect/moveEffect.js";
import Transition from "../effect/transition.js";
import SpriteBlock from "../sprite/spriteBlock.js";
import Point from "../util/point.js";
import Processable from "../util/processable.js";
import Figure from "./Figure.js";
import GameProcess from "./gameProcess.js";

export abstract class AbstractBlock implements Processable {

	protected readonly section: Point;
	public readonly sprite: SpriteBlock;
	
	constructor(section: Point) {
		this.section = section;
		this.sprite = new SpriteBlock();
		this.sprite.size = GameProcess.getCurrentProcess().field.realSectionSize;
		this.sprite.outline = true;
		this.sprite.outlineWidth = 1;
	}

	public update(delta: number): void {}

	public draw(context: CanvasRenderingContext2D) {
		this.sprite.draw(context);
	}

}

/**
 * Represents a block that takes place at the field
 */
export class FieldBlock extends AbstractBlock {

	constructor(section: Point) {
		super(section);
		this.setSpritePosition();
	}

	public getFieldSection() {
		return this.section;
	}

	public moveDown() {
		this.section.y += 1;
		this.setSpritePosition();
	}

	public setSpritePosition() {
		const process = GameProcess.getCurrentProcess();
		this.sprite.position.x = process.field.getRealFieldPosition().x + this.section.x * process.field.realSectionSize;
		this.sprite.position.y = process.field.getRealFieldPosition().y + this.section.y * process.field.realSectionSize;
	}

}

/**
 * Represents a block that is attached to a figure
 */
export class FigureBlock extends AbstractBlock {

	private _figure: Figure;

	private readonly shadow: SpriteBlock;

	public get figure(): Figure {
		return this._figure;
	}

	public set figure(value: Figure) {
		this._figure = value;
		this.sprite.getColor().setTo(this._figure.getColor());
		this.sprite.rotationCenter.setPositionTo(this._figure.rotationCenter.clone().add(this.section));
	}

	/**
	 * Checks whether the block is able to move right
	 * @returns ALLOW if the block is able to move right, BOUNDARY if a wall obstructs the movement, BLOCK if a block obstructs the movement
	 */
	public checkMoveRight(): MoveResult {
		return this.checkMove(1, 0);
	}

	/**
	 * Checks whether the block is able to move left
	 * @returns ALLOW if the block is able to move left, BOUNDARY if a wall obstructs the movement, BLOCK if a block obstructs the movement
	 */
	public checkMoveLeft(): MoveResult {
		return this.checkMove(-1, 0);
	}

	/**
	 * Checks whether the block is able to move down
	 * @returns ALLOW if the block is able to move down, BOUNDARY if a floor obstructs the movement, BLOCK if a block obstructs the movement
	 */
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
			if(newSection.x == block.getFieldSection().x && newSection.y == block.getFieldSection().y) return MoveResult.BLOCK;
		}
		if(field.isSectionInside(newSection)) return MoveResult.ALLOW;
		return MoveResult.BOUNDARY;
	}

	public getFieldSection(): Point {
		return this.section.clone().add(this._figure.section);
	}

	public getRealPosition(): Point {
		const field = GameProcess.getCurrentProcess().field;
		return new Point(
			this.getFieldSection().x * field.realSectionSize + field.getRealFieldPosition().x,
			this.getFieldSection().y * field.realSectionSize + field.getRealFieldPosition().y
		);
	}

	public getShadowSection(): Point {
		return this._figure.getShadowSection().add(this._figure.section);
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
		const rotatedFieldSection = this.findRotatedRelativeSection().add(this._figure.section);
		if(!field.isSectionInsideOrAbove(rotatedFieldSection)) return MoveResult.BOUNDARY;
		for(const field_block of field.blocks) {
			if(field_block.getFieldSection().equals(rotatedFieldSection)) return MoveResult.BLOCK;
		}
		return MoveResult.ALLOW;
	}

	public findRotatedRelativeSection(): Point {
		const origin = this.section.clone().subtract(this._figure.rotationCenter);
		const rotatedOrigin = new Point(-origin.y, origin.x);
		return rotatedOrigin.add(this._figure.rotationCenter);
	}

	public rotateNoRestrictions() {
		this.section.setPositionTo(this.findRotatedRelativeSection());
		this.rotateSpriteWithEffect();
	}

	public getRelativeSection(): Point {
		return this.section;
	}

	/**
	 * Creates a field block with the same coordinates and color
	 * @returns A new field block
	 */
	public toFieldBlock(): FieldBlock {
		const fieldBlock = new FieldBlock(this.getFieldSection());
		fieldBlock.sprite.getColor().setTo(this.sprite.getColor());
		return fieldBlock;
	}

	public updateSpritePosition() {
		this.sprite.position.setPositionTo(this.getRealPosition());
	}

	private moveEffect: MoveEffect;

	public moveSpriteWithEffect() {
		if(this.moveEffect != null) this.moveEffect.interruptNoCallback();
		this.moveEffect = new MoveEffect(this.sprite, this.getRealPosition(), 20);
		this.moveEffect.easing = easeOutQuad;
	}

	private rotationEffect: Transition;

	public rotateSpriteWithEffect() {
		if(this.rotationEffect != null) this.rotationEffect.interruptNoCallback();
		this.rotationEffect = new Transition(value => this.sprite.rotation = value, this.sprite.rotation, this.sprite.rotation + Math.PI / 2, 20);
		this.rotationEffect.easing = easeOutQuad;
	}

	public override draw(context: CanvasRenderingContext2D) {
		super.draw(context);
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