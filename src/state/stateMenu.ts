import Menu from "../menu/menu.js";
import State from "./state.js";

export default class StateMenu extends State {

    private readonly menu: Menu = Menu.getMenu();

    public update(delta: number): void {
        this.menu.update(delta);
    }

    public draw(context: CanvasRenderingContext2D): void {
        this.menu.draw(context);
    }
    
}