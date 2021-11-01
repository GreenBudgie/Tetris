import ColorFadeEffect from "../color/colorFadeEffect.js";
import InputHandler, {KeyBindings} from "../game/inputHandler.js";
import Processable from "../util/processable.js";
import ButtonChallenge from "./buttonChallenge.js";
import ButtonArcade from "./buttonArcade.js";
import ButtonEndless from "./buttonEndless.js";
import MenuButton from "./menuButton.js";

export default class Menu implements Processable {

    private static instance: Menu = null;
    private buttons: MenuButton[] = [];
    private _currentButtonIndex = 0;
    private _currentButton: MenuButton;

    public isFading = false;

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

    private changeCurrentButton(di: number) {
        this.isFading = true;
        const fadeTime = 12;

        new ColorFadeEffect(this.currentButton.currentColor, this.currentButton.grayColor, fadeTime);

        this._currentButtonIndex += di;
        this.updateCurrentButton();

        const fadeEffect = new ColorFadeEffect(this.currentButton.currentColor, this.currentButton.getColor(), fadeTime);
        fadeEffect.callback = () => {
            this.isFading = false;
        };
    }

    public update(delta: number): void {
        for(const button of this.buttons) {
            button.update(delta);
        }
        if(!this.isFading) {
            if(InputHandler.getHandler().isKeyBindingDown(KeyBindings.MENU_BUTTON_DOWN)) {
                if(this._currentButtonIndex < this.buttons.length - 1) {
                    this.changeCurrentButton(1);
                    return;
                }
            }
            if(InputHandler.getHandler().isKeyBindingDown(KeyBindings.MENU_BUTTON_UP)) {
                if(this._currentButtonIndex > 0) {
                    this.changeCurrentButton(-1);
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