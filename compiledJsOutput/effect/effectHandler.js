export default class EffectHandler {
    constructor() {
        this.activeEffects = [];
    }
    static getHandler() {
        if (EffectHandler.instance == null)
            EffectHandler.instance = new EffectHandler();
        return EffectHandler.instance;
    }
    update(delta) {
        this.activeEffects = this.activeEffects.filter(effect => effect.isActive);
        this.activeEffects.forEach(effect => effect.update(delta));
    }
    draw(context) {
        this.activeEffects.forEach(effect => effect.draw(context));
    }
}
//# sourceMappingURL=effectHandler.js.map