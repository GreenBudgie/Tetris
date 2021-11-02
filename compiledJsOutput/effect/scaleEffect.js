import Effect from "./effect.js";
export default class ScaleEffect extends Effect {
    constructor(toScale, scale, time) {
        super(time);
        this.toScale = toScale;
        this.startScale = toScale.scale;
        this.endScale = scale;
    }
    onUpdate(delta) {
        this.toScale.scale = this.startScale + (this.endScale - this.startScale) * this.progress;
    }
    onEnd() {
        this.toScale.scale = this.endScale;
    }
}
//# sourceMappingURL=scaleEffect.js.map