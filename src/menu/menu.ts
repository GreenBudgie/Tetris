import InputHandler, {KeyBinding, KeyBindings} from "../game/inputHandler.js";
import Processable from "../util/processable.js";
import ButtonArcade from "./buttonArcade.js";
import ButtonEndless from "./buttonEndless.js";
import MenuButton from "./menuButton.js";

export default class Menu implements Processable {

    private static instance: Menu = null;
    private buttons: MenuButton[] = [
        new ButtonArcade(),
    ];
    private currentButtonIndex = 0;
    private _currentButton: MenuButton = this.buttons[this.currentButtonIndex];

    private constructor() {}

    public get currentButton(): MenuButton {
        return this._currentButton;
    }

    public static getMenu(): Menu {
        if(Menu.instance == null) Menu.instance = new Menu();
        return Menu.instance;
    }

    public update(delta: number): void {
        for(const button of this.buttons) {
            button.update(delta);
        }
        if(InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_BUTTON_UP)) {
            this.currentButtonIndex = this.currentButtonIndex >= this.buttons.length - 1 ? 0 : this.currentButtonIndex + 1;
            this.updateCurrentButton();
        }
        if(InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_BUTTON_DOWN)) {
            this.currentButtonIndex = this.currentButtonIndex <= 0 ? this.buttons.length - 1 : this.currentButtonIndex - 1;
            this.updateCurrentButton();
        }
        if(InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_BUTTON_CLICK)) {
            this._currentButton.onClick();
        }
    }

    private updateCurrentButton() {
        this._currentButton = this.buttons[this.currentButtonIndex];
    }

    public draw(context: CanvasRenderingContext2D): void {
        for(const button of this.buttons) {
            button.draw(context);
        }
    }
    
}