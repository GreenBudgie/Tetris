export default class EffectHandler {
    constructor() {
        this.activeEffects = [];
    }
    update(delta) {
        this.activeEffects = this.activeEffects.filter(effect => !effect.isEnded);
        this.activeEffects.forEach(effect => effect.update(delta));
    }
    draw(context) {
        this.activeEffects.forEach(effect => effect.draw(context));
    }
}
//# sourceMappingURL=effectHandler.js.map