import Effect from "../effect/effect.js";
import Menu from "./menu.js";
export default class ButtonMoveEffect extends Effect {
    constructor(button, direction) {
        super(20);
        this.button = button;
        let prevIndex;
        if (direction == "up")
            prevIndex = 1;
        else
            prevIndex = -1;
        this.startY = button.getYForIndex(Menu.getMenu().currentButtonIndex + prevIndex);
        this.endY = button.getYForIndex(Menu.getMenu().currentButtonIndex);
        this.onEnd = () => this.button.y = this.endY;
    }
    update(delta) {
        super.update(delta);
        this.button.y = (this.endY - this.startY) * this.progress + this.startY;
    }
}
//# sourceMappingURL=buttonMoveEffect.js.map