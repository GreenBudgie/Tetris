import InputHandler, { KeyBindings } from "../game/inputHandler.js";
import ButtonArcade from "./buttonArcade.js";
import ButtonEndless from "./buttonEndless.js";
export default class Menu {
    constructor() {
        this.buttons = [
            new ButtonArcade(0),
            new ButtonEndless(1)
        ];
        this._currentButtonIndex = 0;
        this._currentButton = this.buttons[this._currentButtonIndex];
    }
    get currentButton() {
        return this._currentButton;
    }
    get currentButtonIndex() {
        return this._currentButtonIndex;
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
            this._currentButtonIndex = this._currentButtonIndex >= this.buttons.length - 1 ? 0 : this._currentButtonIndex + 1;
            this.updateCurrentButton();
        }
        if (InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_BUTTON_DOWN)) {
            this._currentButtonIndex = this._currentButtonIndex <= 0 ? this.buttons.length - 1 : this._currentButtonIndex - 1;
            this.updateCurrentButton();
        }
        if (InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_BUTTON_CLICK)) {
            this._currentButton.onClick();
        }
    }
    updateCurrentButton() {
        this._currentButton = this.buttons[this._currentButtonIndex];
    }
    draw(context) {
        for (const button of this.buttons) {
            button.draw(context);
        }
    }
}
Menu.instance = null;
//# sourceMappingURL=menu.js.map