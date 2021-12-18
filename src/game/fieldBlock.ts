import SpriteBlock from "../sprite/spriteBlock.js";
import Point from "../util/point.js";
import {Drawable} from "../util/processable.js";
import GameProcess from "./gameProcess.js";

/**
 * Represents a block that takes place at the field
 */
 export class FieldBlock implements Drawable {

    public readonly section: Point;
    public readonly sprite: SpriteBlock;

	constructor(section: Point) {
		this.section = section;
        this.sprite = new SpriteBlock();
		this.sprite.size = GameProcess.getCurrentProcess().field.realSectionSize;
		this.sprite.outline = true;
		this.sprite.outlineWidth = 1;
		this.setSpritePosition();
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

    public draw(context: CanvasRenderingContext2D): void {
        this.sprite.draw(context);
    }


}