import ColorFadeEffect from "../color/colorFadeEffect.js";
import InputHandler, { KeyBindings } from "../main/inputHandler.js";
import ButtonChallenge from "./buttonChallenge.js";
import ButtonArcade from "./buttonArcade.js";
import ButtonEndless from "./buttonEndless.js";
import ArcadeHandler from "./arcade/arcadeHandler.js";
import SpriteFigure from "../sprite/spriteFigure.js";
import Transition from "../effect/transition.js";
export default class Menu {
    constructor() {
        this.buttons = [];
        this._currentButtonIndex = 0;
        this.isFading = false;
        this.test = new SpriteFigure([[0, 0], [0, 1], [0, 2], [1, 2]]);
        Menu.instance = this;
        this.buttons = [
            new ButtonArcade(0),
            new ButtonEndless(1),
            new ButtonChallenge(2)
        ];
        this._currentButton = this.buttons[this._currentButtonIndex];
        this._currentButton.onSelect();
        this.test.x = 300;
        this.test.y = 300;
        this.test.rotationCenter = [this.test.blockSize, this.test.blockSize];
        this.test.outlineMode = "block";
        this.test.getColor().setComponents(255, 90, 90);
        new Transition(value => { this.test.rotation = value; }, 0, 10 * Math.PI, 300);
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