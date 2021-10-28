import Effect from "../effect/effect.js";
import { easeInQuad, easeOutQuad } from "../effect/effectEasings.js";
import Menu from "./menu.js";
export default class ButtonMoveEffect extends Effect {
    constructor(button, direction) {
        super(20);
        this.button = button;
        let prevIndex;
        if (direction == "up") {
            prevIndex = 1;
            this.easingFunction = easeOutQuad;
        }
        else {
            prevIndex = -1;
            this.easingFunction = easeInQuad;
        }
        this.startY = button.getYForIndex(Menu.getMenu().currentButtonIndex + prevIndex);
        this.endY = button.getYForIndex(Menu.getMenu().currentButtonIndex);
    }
    onEnd() {
        this.button.y = this.endY;
    }
    onUpdate(delta) {
        this.button.y = (this.endY - this.startY) * this.progressEased(this.easingFunction) + this.startY;
    }
}
//# sourceMappingURL=buttonMoveEffect.js.map