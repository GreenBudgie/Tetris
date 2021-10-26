import Tetris from "../game/tetris";
/**
 * Effects provide an easy way of handling
 * animations and transitions of any objects in the game
 */
export default class Effect {
    constructor(time) {
        this.isEnded = false;
        this.isPaused = false;
        this.time = time;
        this.onBegin();
    }
    pause() {
        this.isPaused = true;
    }
    resume() {
        this.isPaused = false;
    }
    interrupt() {
        this.end();
    }
    end() {
        this.onEnd();
        this.isEnded = true;
    }
    onBegin() { }
    onEnd() { }
    update(delta) {
        if (this.isEnded)
            return;
        this.time -= delta * Tetris.FPS;
        if (this.time <= 0) {
            this.end();
        }
    }
    draw(context) {
        if (this.isEnded)
            return;
    }
}
//# sourceMappingURL=effect.js.map