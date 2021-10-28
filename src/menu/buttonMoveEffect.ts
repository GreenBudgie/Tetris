import Effect from "../effect/effect.js";
import {easeInQuad, easeOutQuad} from "../effect/effectEasings.js";
import Menu from "./menu.js";
import MenuButton from "./menuButton.js";

export default class ButtonMoveEffect extends Effect {

    public button: MenuButton;
    public startY: number;
    public endY: number;

    private easingFunction: (elapsed: number, initialValue: number, amountOfChange: number, duration: number) => number;

    public constructor(button: MenuButton, direction: "up" | "down") {
        super(18);
        this.button = button;
        let prevIndex: number;
        if(direction == "up") {
            prevIndex = 1;
            this.easingFunction = easeOutQuad;
         } else {
            prevIndex = -1;
            this.easingFunction = easeInQuad;
         }
        this.startY = button.getYForIndex(Menu.getMenu().currentButtonIndex + prevIndex);
        this.endY = button.getYForIndex(Menu.getMenu().currentButtonIndex);
    }

    public override onEnd(): void {
        this.button.y = this.endY;
        Menu.getMenu().isMoving = false;
    }

    public override onUpdate(delta: number) {
        this.button.y = (this.endY - this.startY) * this.progressEased(this.easingFunction) + this.startY;
    }

}