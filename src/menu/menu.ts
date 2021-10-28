import Effect from "../effect/effect.js";
import InputHandler, {KeyBinding, KeyBindings} from "../game/inputHandler.js";
import Processable from "../util/processable.js";
import ButtonArcade from "./buttonArcade.js";
import ButtonChallenge from "./buttonChallenge.js";
import ButtonEndless from "./buttonEndless.js";
import ButtonMoveEffect from "./buttonMoveEffect.js";
import MenuButton from "./menuButton.js";

export default class Menu implements Processable {

    private static instance: Menu = null;
    private buttons: MenuButton[] = [];
    private _currentButtonIndex = 0;
    private _currentButton: MenuButton;

    public isMoving = false;

    private constructor() {
        Menu.instance = this;
        this.buttons = [
            new ButtonArcade(0),
            new ButtonEndless(1),
            new ButtonChallenge(2)
        ];
        this._currentButton = this.buttons[this._currentButtonIndex];
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

    private moveButtonsDown() {
        this.isMoving = true;
        this._currentButtonIndex++;
        this.buttons.forEach(button => new ButtonMoveEffect(button, "down"));
    }

    private moveButtonsUp() {
        this.isMoving = true;
        this._currentButtonIndex--;
        this.buttons.forEach(button => new ButtonMoveEffect(button, "up"));
    }

    public update(delta: number): void {
        for(const button of this.buttons) {
            button.update(delta);
        }
        if(!this.isMoving) {
            if(InputHandler.getHandler().isKeyBindingDown(KeyBindings.MENU_BUTTON_DOWN)) {
                if(this._currentButtonIndex < this.buttons.length - 1) {
                    this.moveButtonsDown();
                    this.updateCurrentButton();
                    return;
                }
            }
            if(InputHandler.getHandler().isKeyBindingDown(KeyBindings.MENU_BUTTON_UP)) {
                if(this._currentButtonIndex > 0) {
                    this.moveButtonsUp();
                    this.updateCurrentButton();
                }
            }
        }
        if(InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_BUTTON_CLICK)) {
            this._currentButton.onClick();
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