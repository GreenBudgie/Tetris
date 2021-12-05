import GameProcess from "../game/gameProcess.js";
import Levels from "../game/levels.js";
import State from "./state.js";
export default class StateGame extends State {
    constructor() {
        super();
        GameProcess.initiate(Levels.LEVEL_1);
    }
    onEnd() {
        GameProcess.terminate();
    }
    update(delta) {
        GameProcess.getCurrentProcess().update(delta);
    }
    draw(context) {
        GameProcess.getCurrentProcess().draw(context);
    }
}
//# sourceMappingURL=stateGame.js.map