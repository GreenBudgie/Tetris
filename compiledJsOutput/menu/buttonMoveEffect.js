import Effect from "../effect/effect.js";
import { easeInQuad, easeOutQuad } from "../effect/effectEasings.js";
import Menu from "./menu.js";
export default class ButtonMoveEffect extends Effect {
    constructor(button, direction) {
        const delay = 0;
        super(100);
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
        this.onEnd = () => this.button.y = this.endY;
    }
    update(delta) {
        super.update(delta);
        this.button.y = (this.endY - this.startY) * this.progressEased(this.easingFunction) + this.startY;
    }
}
//# sourceMappingURL=buttonMoveEffect.js.map