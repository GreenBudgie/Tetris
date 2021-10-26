import Processable from "../util/processable";
import Effect from "./effect";

export default class EffectHandler implements Processable {
    
    public activeEffects: Effect[] = [];

    public update(delta: number): void {
        this.activeEffects = this.activeEffects.filter(effect => !effect.isEnded);
        this.activeEffects.forEach(effect => effect.update(delta));
    }

    public draw(context: CanvasRenderingContext2D): void {
        this.activeEffects.forEach(effect => effect.draw(context));
    }
    
}