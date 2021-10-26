import InputHandler, { KeyBindings } from "../game/inputHandler.js";
import ButtonArcade from "./buttonArcade.js";
export default class Menu {
    constructor() {
        this.buttons = [
            new ButtonArcade(),
        ];
        this.currentButtonIndex = 0;
        this._currentButton = this.buttons[this.currentButtonIndex];
    }
    get currentButton() {
        return this._currentButton;
    }
    static getMenu() {
        if (Menu.instance == null)
            Menu.instance = new Menu();
        return Menu.instance;
    }
    update(delta) {
        for (const button of this.buttons) {
            button.update(delta);
        }
        if (InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_BUTTON_UP)) {
            this.currentButtonIndex = this.currentButtonIndex >= this.buttons.length - 1 ? 0 : this.currentButtonIndex + 1;
            this.updateCurrentButton();
        }
        if (InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_BUTTON_DOWN)) {
            this.currentButtonIndex = this.currentButtonIndex <= 0 ? this.buttons.length - 1 : this.currentButtonIndex - 1;
            this.updateCurrentButton();
        }
        if (InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_BUTTON_CLICK)) {
            this._currentButton.onClick();
        }
    }
    updateCurrentButton() {
        this._currentButton = this.buttons[this.currentButtonIndex];
    }
    draw(context) {
        for (const button of this.buttons) {
            button.draw(context);
        }
    }
}
Menu.instance = null;
//# sourceMappingURL=menu.js.map