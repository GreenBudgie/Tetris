import Levels from "../game/levels.js";
import State from "./state.js";
export default class StateGame extends State {
    constructor() {
        super();
        this._level = Levels.LEVEL_1;
    }
    get level() {
        return this._level;
    }
    set level(level) {
        this._level = level;
    }
    update(delta) {
        this._level.update(delta);
    }
    draw(context) {
        this._level.draw(context);
    }
}
//# sourceMappingURL=stateGame.js.map