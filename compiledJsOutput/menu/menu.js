import ColorFadeEffect from "../color/colorFadeEffect.js";
import InputHandler, { KeyBindings } from "../game/inputHandler.js";
import ButtonChallenge from "./buttonChallenge.js";
import ButtonArcade from "./buttonArcade.js";
import ButtonEndless from "./buttonEndless.js";
import ArcadeHandler from "./arcade/arcadeHandler.js";
export default class Menu {
    constructor() {
        this.buttons = [];
        this._currentButtonIndex = 0;
        this.isFading = false;
        Menu.instance = this;
        this.buttons = [
            new ButtonArcade(0),
            new ButtonEndless(1),
            new ButtonChallenge(2)
        ];
        this._currentButton = this.buttons[this._currentButtonIndex];
        this._currentButton.onSelect();
    }
    get currentButton() {
        return this._currentButton;
    }
    get currentButtonIndex() {
        return this._currentButtonIndex;
    }
    static getMenu() {
        if (Menu.instance == null)
            new Menu();
        return Menu.instance;
    }
    changeCurrentButton(di) {
        this.isFading = true;
        const fadeTime = 12;
        new ColorFadeEffect(this.currentButton.currentColor, this.currentButton.grayColor, fadeTime);
        this._currentButton.onDeselect();
        this._currentButtonIndex += di;
        this.updateCurrentButton();
        this._currentButton.onSelect();
        const fadeEffect = new ColorFadeEffect(this.currentButton.currentColor, this.currentButton.getColor(), fadeTime);
        fadeEffect.callback = () => {
            this.isFading = false;
        };
    }
    update(delta) {
        for (const button of this.buttons) {
            button.update(delta);
        }
        const listenToInputs = !ArcadeHandler.getHandler().isSelectingStages;
        if (!this.isFading && listenToInputs) {
            if (InputHandler.getHandler().isKeyBindingDown(KeyBindings.MENU_DOWN)) {
                if (this._currentButtonIndex < this.buttons.length - 1) {
                    this.changeCurrentButton(1);
                    return;
                }
            }
            if (InputHandler.getHandler().isKeyBindingDown(KeyBindings.MENU_UP)) {
                if (this._currentButtonIndex > 0) {
                    this.changeCurrentButton(-1);
                }
            }
        }
        if (listenToInputs &&
            (InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_BUTTON_CLICK) ||
                InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_RIGHT))) {
            this._currentButton.click();
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