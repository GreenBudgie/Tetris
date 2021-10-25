import ButtonArcade from "./buttonArcade.js";
export default class Menu {
    constructor() {
        this.buttons = [
            new ButtonArcade()
        ];
    }
    static getMenu() {
        if (Menu.instance == null)
            Menu.instance = new Menu();
        return Menu.instance;
    }
    update(delta) {
        for (const button of this.buttons) {
            button.update(delta);
        }
    }
    draw(context) {
        for (const button of this.buttons) {
            button.draw(context);
        }
    }
}
Menu.instance = null;
//# sourceMappingURL=menu.js.map