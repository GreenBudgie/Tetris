import Scalable from "../util/scalable.js";
import Effect from "./effect.js";

export default class ScaleEffect extends Effect {

    private readonly toScale: Scalable;
    private readonly startScale: number;
    private readonly endScale: number;

    public constructor(toScale: Scalable, scale: number, time: number) {
        super(time);
        this.toScale = toScale;
        this.startScale = toScale.scale;
        this.endScale = scale;
    }

    public override onUpdate(delta: number) {
        this.toScale.scale = this.startScale + (this.endScale - this.startScale) * this.progress;
    }

    public override onEnd() {
        this.toScale.scale = this.endScale;
    }

}