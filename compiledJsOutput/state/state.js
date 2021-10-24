import StateHandler from "./stateHandler.js";
export default class State {
    onBegin() { }
    ;
    onEnd() { }
    ;
    begin() {
        StateHandler.getHandler().currentState = this;
        this.onBegin();
    }
    end() {
        this.onEnd();
    }
    isRunning() {
        return this == StateHandler.getHandler().currentState;
    }
}
//# sourceMappingURL=state.js.map