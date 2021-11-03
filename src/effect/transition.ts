import Effect from "./effect.js";

/**
 * An effect that will gradually change any given numerical value.
 * Transition function is used for this.
 */
export default class Transition extends Effect {

    private transitionFunction: (value: number) => void;
    private from: number;
    private to: number;

    public constructor(transitionFunction: (value: number) => void, from: number, to: number, time: number) {
        super(time);
        this.transitionFunction = transitionFunction;
        this.from = from;
        this.to = to;
    }

    private getCurrentValue(): number {
        return this.from + (this.to - this.from) * this.progress;
    }

    public override onUpdate() {
        this.transitionFunction(this.getCurrentValue());
    }

    public override onEnd() {
        this.transitionFunction(this.to);
    }

}