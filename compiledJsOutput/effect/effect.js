import Tetris from "../game/tetris.js";
import EffectHandler from "./effectHandler.js";
/**
 * Effects provide an easy way of handling
 * animations and transitions of any objects in the game
 */
export default class Effect {
    constructor(time) {
        this._isActive = true;
        this._isPaused = false;
        this._progress = 0;
        this.maxTime = time;
        this.time = time;
        EffectHandler.getHandler().activeEffects.push(this);
    }
    get progress() {
        return this._progress;
    }
    get isPaused() {
        return this._isPaused;
    }
    get isActive() {
        return this._isActive;
    }
    pause() {
        this._isPaused = true;
    }
    resume() {
        this._isPaused = false;
    }
    interrupt() {
        this.end();
    }
    end() {
        this.onEnd();
        this._isActive = false;
    }
    update(delta) {
        if (!this._isActive)
            return;
        this.time -= delta * Tetris.FPS;
        this._progress = 1 - this.time / this.maxTime;
        if (this.time <= 0) {
            this.end();
        }
    }
    draw(context) {
        if (!this._isActive)
            return;
    }
}
//# sourceMappingURL=effect.js.map