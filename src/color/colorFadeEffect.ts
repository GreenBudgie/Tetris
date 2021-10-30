import Effect from "../effect/effect.js";
import RGBColor from "./rgbColor.js";

export default class ColorFadeEffect extends Effect {

    private readonly startColor: RGBColor;
    private readonly endColor: RGBColor;
    private readonly colorToFade: RGBColor;

    public constructor(toFade: RGBColor, target: RGBColor, time: number) {
        super(time);
        this.colorToFade = toFade;
        this.startColor = toFade.clone();
        this.endColor = target;
    }

    public override onUpdate(delta: number) {
        const fadedColor = this.startColor.clone();
        fadedColor.instantFadeTo(this.endColor, this.progress);
        this.colorToFade.setTo(fadedColor);
    }

}