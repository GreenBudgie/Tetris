import Effect from "../effect/effect.js";
export default class ColorFadeEffect extends Effect {
    constructor(toFade, target, time) {
        super(time);
        this.colorToFade = toFade;
        this.startColor = toFade.clone();
        this.endColor = target;
    }
    onUpdate(delta) {
        const fadedColor = this.startColor.clone();
        fadedColor.instantFadeTo(this.endColor, this.progress);
        this.colorToFade.setTo(fadedColor);
    }
    onEnd() {
        this.colorToFade.setTo(this.endColor);
    }
}
//# sourceMappingURL=colorFadeEffect.js.map