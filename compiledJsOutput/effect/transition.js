import Effect from "./effect.js";
/**
 * An effect that will gradually change any given numerical value.
 * Transition function is used for this.
 */
export default class Transition extends Effect {
    constructor(transitionFunction, from, to, time) {
        super(time);
        this.transitionFunction = transitionFunction;
        this.from = from;
        this.to = to;
    }
    getCurrentValue() {
        return this.from + (this.to - this.from) * this.progress;
    }
    onUpdate() {
        this.transitionFunction(this.getCurrentValue());
    }
    setTargetValues() {
        this.transitionFunction(this.to);
    }
}
//# sourceMappingURL=transition.js.map