import Processable from "../util/processable";
import Effect from "./effect";

export default class EffectHandler implements Processable {
    
    public activeEffects: Effect[] = [];
    private static instance: EffectHandler;

    private constructor() {}

    public static getHandler(): EffectHandler {
        if(EffectHandler.instance == null) EffectHandler.instance = new EffectHandler();
        return EffectHandler.instance;
    }

    public update(delta: number): void {
        this.activeEffects = this.activeEffects.filter(effect => effect.isActive);
        this.activeEffects.forEach(effect => effect.update(delta));
    }

    public draw(context: CanvasRenderingContext2D): void {
        this.activeEffects.forEach(effect => effect.draw(context));
    }
    
}