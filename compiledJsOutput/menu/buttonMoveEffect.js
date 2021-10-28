import Effect from "../effect/effect.js";
import Menu from "./menu.js";
import * as Easing from "../../node_modules/js-easing-functions/dist/index.js";
export default class ButtonMoveEffect extends Effect {
    constructor(button, direction) {
        super(20);
        this.button = button;
        let prevIndex;
        if (direction == "up") {
            prevIndex = 1;
            this.easingFunction = Easing.easeOutQuint;
        }
        else {
            prevIndex = -1;
            this.easingFunction = Easing.easeInQuint;
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