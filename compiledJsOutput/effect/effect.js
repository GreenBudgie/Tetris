import Tetris from "../game/tetris.js";
import EffectHandler from "./effectHandler.js";
/**
 * Effects provide an easy way of handling
 * animations and transitions of any objects in the game
 */
export default class Effect {
    constructor(time, initialDelay) {
        this._isActive = true;
        this._isPaused = false;
        this._pauseDelay = 0;
        this._progress = 0;
        this.callback = () => { };
        this.maxTime = time;
        this.time = time;
        if (initialDelay != null && initialDelay != undefined)
            this.pause(initialDelay);
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
    onEnd() { }
    onUpdate(delta) { }
    /**
     * Returns the progress of the effect clamped between specified values
     * @example If the real progress is 0.5, min = 1, max = 3, this will return 2
     * @param min Minimum value
     * @param max Maximum value
     * @returns A progress value between min and max
     */
    progressClamped(min, max) {
        return (max - min) * this.progress + min;
    }
    /**
     * Applies the easing function to the progress clamped between specified values
     * @param min Minimum value
     * @param max Maximum value
     * @param easingFunction A function to apply
     * @returns Eased and clamped progress
     */
    progressEasedClamped(min, max, easingFunction) {
        return easingFunction(this.progress, min, max - min, 1);
    }
    /**
     * Applies the easing function to the progress
     * @param easingFunction A function to apply
     * @returns Eased progress
     */
    progressEased(easingFunction) {
        return easingFunction(this.progress, 0, 1, 1);
    }
    pause(delay) {
        this._isPaused = true;
        if (delay != null && delay != undefined)
            this._pauseDelay = delay;
        else
            this._pauseDelay = -1;
    }
    resume() {
        this._isPaused = false;
    }
    interrupt() {
        this.end();
    }
    end() {
        this.callback();
        this.onEnd();
        this._isActive = false;
    }
    update(delta) {
        if (!this._isActive)
            return;
        if (this._isPaused) {
            if (this._pauseDelay != -1) {
                this._pauseDelay--;
                if (this._pauseDelay <= 0)
                    this.resume();
            }
        }
        else {
            this.time -= delta * Tetris.FPS;
            this._progress = 1 - this.time / this.maxTime;
            if (this.time <= 0) {
                this.end();
            }
            else {
                this.onUpdate(delta);
            }
        }
    }
    draw(context) {
        if (!this._isActive)
            return;
    }
}
//# sourceMappingURL=effect.js.map