import Processable from "../util/processable.js";
import ButtonArcade from "./buttonArcade.js";
import MenuButton from "./menuButton.js";

export default class Menu implements Processable {

    private static instance: Menu = null;
    private buttons: MenuButton[] = [
        new ButtonArcade()
    ];

    private constructor() {}

    public static getMenu(): Menu {
        if(Menu.instance == null) Menu.instance = new Menu();
        return Menu.instance;
    }

    public update(delta: number): void {
        for(const button of this.buttons) {
            button.update(delta);
        }
    }

    public draw(context: CanvasRenderingContext2D): void {
        for(const button of this.buttons) {
            button.draw(context);
        }
    }
    
}