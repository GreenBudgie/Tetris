import Effect from "./effect.js";
export default class CustomEffect extends Effect {
    constructor(changeFunction, from, to, time) {
        super(time);
        this.changeFunction = changeFunction;
        this.from = from;
        this.to = to;
    }
    getCurrentValue() {
        return this.from + (this.to - this.from) * this.progress;
    }
    onUpdate() {
        this.changeFunction(this.getCurrentValue());
    }
    onEnd() {
        this.changeFunction(this.to);
    }
}
//# sourceMappingURL=customEffect.js.map