import StateGame from "./stateGame.js";
import StateMenu from "./stateMenu.js";
export default class StateHandler {
    constructor() {
        this.GAME = new StateGame();
        this.MENU = new StateMenu();
    }
    update(delta) {
        this._currentState.update(delta);
    }
    draw(context) {
        this._currentState.draw(context);
    }
    get currentState() {
        return this._currentState;
    }
    set currentState(state) {
        this._currentState = state;
    }
    static getHandler() {
        if (StateHandler.instance == null)
            StateHandler.instance = new StateHandler();
        return StateHandler.instance;
    }
}
StateHandler.instance = null;
//# sourceMappingURL=stateHandler.js.map