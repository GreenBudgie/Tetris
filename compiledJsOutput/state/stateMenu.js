import Menu from "../menu/menu.js";
import State from "./state.js";
export default class StateMenu extends State {
    constructor() {
        super(...arguments);
        this.menu = Menu.getMenu();
    }
    update(delta) {
        this.menu.update(delta);
    }
    draw(context) {
        this.menu.draw(context);
    }
}
//# sourceMappingURL=stateMenu.js.map