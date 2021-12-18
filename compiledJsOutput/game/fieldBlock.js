import SpriteBlock from "../sprite/spriteBlock.js";
import GameProcess from "./gameProcess.js";
/**
 * Represents a block that takes place at the field
 */
export class FieldBlock {
    constructor(section) {
        this.section = section;
        this.sprite = new SpriteBlock();
        this.sprite.size = GameProcess.getCurrentProcess().field.realSectionSize;
        this.sprite.outline = true;
        this.sprite.outlineWidth = 1;
        this.setSpritePosition();
    }
    moveDown() {
        this.section.y += 1;
        this.setSpritePosition();
    }
    setSpritePosition() {
        const process = GameProcess.getCurrentProcess();
        this.sprite.position.x = process.field.getRealFieldPosition().x + this.section.x * process.field.realSectionSize;
        this.sprite.position.y = process.field.getRealFieldPosition().y + this.section.y * process.field.realSectionSize;
    }
    draw(context) {
        this.sprite.draw(context);
    }
}
//# sourceMappingURL=fieldBlock.js.map