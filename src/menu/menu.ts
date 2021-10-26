import InputHandler, {KeyBinding, KeyBindings} from "../game/inputHandler.js";
import Processable from "../util/processable.js";
import ButtonArcade from "./buttonArcade.js";
import ButtonEndless from "./buttonEndless.js";
import MenuButton from "./menuButton.js";

export default class Menu implements Processable {

    private static instance: Menu = null;
    private buttons: MenuButton[] = [
        new ButtonArcade(0),
        new ButtonEndless(1)
    ];
    private _currentButtonIndex = 0;
    private _currentButton: MenuButton = this.buttons[this._currentButtonIndex];

    private constructor() {}

    public get currentButton(): MenuButton {
        return this._currentButton;
    }

    public get currentButtonIndex(): number {
        return this._currentButtonIndex;
    }

    public static getMenu(): Menu {
        if(Menu.instance == null) Menu.instance = new Menu();
        return Menu.instance;
    }

    public update(delta: number): void {
        for(const button of this.buttons) {
            button.update(delta);
        }
        if(InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_BUTTON_DOWN)) {
            if(this._currentButtonIndex < this.buttons.length - 1) this._currentButtonIndex++;
            this.updateCurrentButton();
        }
        if(InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_BUTTON_UP)) {
            if(this._currentButtonIndex > 0) this._currentButtonIndex--;
            this.updateCurrentButton();
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