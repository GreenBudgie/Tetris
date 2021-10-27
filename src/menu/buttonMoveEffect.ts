import Effect from "../effect/effect.js";
import Menu from "./menu.js";
import MenuButton from "./menuButton.js";

export default class ButtonMoveEffect extends Effect {

    public button: MenuButton;
    public startY: number;
    public endY: number;

    public constructor(button: MenuButton, direction: "up" | "down") {
        super(20);
        this.button = button;
        let prevIndex: number;
        if(direction == "up") prevIndex = 1; else prevIndex = -1;
        this.startY = button.getYForIndex(Menu.getMenu().currentButtonIndex + prevIndex);
        this.endY = button.getYForIndex(Menu.getMenu().currentButtonIndex);
        this.onEnd = () => this.button.y = this.endY;
    }

    public override update(delta: number) {
        super.update(delta);
        this.button.y = (this.endY - this.startY) * this.progress + this.startY;
    }

}