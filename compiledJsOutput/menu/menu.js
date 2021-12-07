import ColorFadeEffect from "../color/colorFadeEffect.js";
import InputHandler, { KeyBindings } from "../main/inputHandler.js";
import ButtonChallenge from "./buttonChallenge.js";
import ButtonArcade from "./buttonArcade.js";
import ButtonEndless from "./buttonEndless.js";
import ArcadeHandler from "./arcade/arcadeHandler.js";
import Transition from "../effect/transition.js";
import SpriteBlock from "../sprite/spriteBlock.js";
export default class Menu {
    constructor() {
        this.buttons = [];
        this._currentButtonIndex = 0;
        this.isFading = false;
        this.test = new SpriteBlock();
        Menu.instance = this;
        this.buttons = [
            new ButtonArcade(0),
            new ButtonEndless(1),
            new ButtonChallenge(2)
        ];
        this._currentButton = this.buttons[this._currentButtonIndex];
        this._currentButton.onSelect();
        this.test.position.setPosition(300, 300);
        this.test.rotationCenter.setPosition(-1, -1);
        this.test.outline = true;
        this.test.getColor().setComponents(255, 90, 90);
        new Transition(value => { this.test.rotation = value; }, 0, Math.PI * (3 / 4), 100);
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
        new ColorFadeEffect(this.currentButton.sprite.getColor(), this.currentButton.grayColor, fadeTime);
        this._currentButton.onDeselect();
        this._currentButtonIndex += di;
        this.updateCurrentButton();
        this._currentButton.onSelect();
        const fadeEffect = new ColorFadeEffect(this.currentButton.sprite.getColor(), this.currentButton.getColor(), fadeTime);
        fadeEffect.callback = () => {
            this.isFading = false;
        };
    }
    update(delta) {
        for (const button of this.buttons) {
            button.update(delta);
        }
        const listenToInputs = ArcadeHandler.getHandler().state == "hide" || ArcadeHandler.getHandler().state == "show";
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
            (InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_SELECT) ||
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
        this.test.draw(context);
    }
}
Menu.instance = null;
//# sourceMappingURL=menu.js.map