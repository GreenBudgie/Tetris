import ColorFadeEffect from "../color/colorFadeEffect.js";
import InputHandler, {KeyBindings} from "../main/inputHandler.js";
import Processable from "../util/processable.js";
import ButtonChallenge from "./buttonChallenge.js";
import ButtonArcade from "./buttonArcade.js";
import ButtonEndless from "./buttonEndless.js";
import MenuButton from "./menuButton.js";
import ArcadeHandler from "./arcade/arcadeHandler.js";
import {easeInOutQuad, easeOutQuad} from "../effect/effectEasings.js";

export default class Menu implements Processable {

    private static instance: Menu = null;
    private buttons: MenuButton[] = [];
    private _currentButtonIndex = 0;
    private _currentButton: MenuButton;

    private constructor() {
        Menu.instance = this;
        this.buttons = [
            new ButtonArcade(0),
            new ButtonEndless(1),
            new ButtonChallenge(2)
        ];
        this._currentButton = this.buttons[this._currentButtonIndex];
        this._currentButton.onSelect();
    }

    public get currentButton(): MenuButton {
        return this._currentButton;
    }

    public get currentButtonIndex(): number {
        return this._currentButtonIndex;
    }

    public static getMenu(): Menu {
        if(Menu.instance == null) new Menu();
        return Menu.instance;
    }

    private changeCurrentButton(di: number) {
        this._currentButton.deselectEffect?.interrupt(false, false);
        this._currentButton.selectEffect?.interrupt(false, false);

        const fadeTime = 20;

        this._currentButton.deselectEffect = new ColorFadeEffect(this.currentButton.sprite.getColor(), this.currentButton.grayColor, fadeTime);
        this._currentButton.deselectEffect.easing = easeOutQuad;
        this._currentButton.onDeselect();

        this._currentButtonIndex += di;
        this.updateCurrentButton();
        this._currentButton.onSelect();

        this._currentButton.selectEffect = new ColorFadeEffect(this.currentButton.sprite.getColor(), this.currentButton.getColor(), fadeTime);
        this._currentButton.selectEffect.easing = easeOutQuad;
    }

    public update(delta: number): void {
        for(const button of this.buttons) {
            button.update(delta);
        }
        const listenToInputs = ArcadeHandler.getHandler().state == "hide" || ArcadeHandler.getHandler().state == "show";
        if(listenToInputs) {
            if(InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_DOWN)) {
                if(this._currentButtonIndex < this.buttons.length - 1) {
                    this.changeCurrentButton(1);
                    return;
                }
            }
            if(InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_UP)) {
                if(this._currentButtonIndex > 0) {
                    this.changeCurrentButton(-1);
                }
            }
            if(InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_SELECT) || 
                InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_RIGHT)) {
                this._currentButton.click();
            }
        }
    }

    private updateCurrentButton() {
        this._currentButton = this.buttons[this._currentButtonIndex];
    }

    public draw(context: CanvasRenderingContext2D): void {
        for(const button of this.buttons) {
            button.draw(context);
        }
    }
    
}