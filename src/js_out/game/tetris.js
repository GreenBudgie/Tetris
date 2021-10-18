import InputHandler from "./input_handler.js";
import Levels from "../level/levels.js";
export default class Tetris {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext("2d");
        this.window_width = this.canvas.width;
        this.window_height = this.canvas.height;
        this.previousTimestamp = 0;
        Tetris._instance = this;
        this.startGame();
    }
    static get instance() {
        return this._instance;
    }
    fixCanvasScaling() {
        const scaling = window.devicePixelRatio;
        this.canvas.style.width = this.canvas.offsetWidth + "px";
        this.canvas.style.height = this.canvas.offsetHeight + "px";
        this.canvas.width *= scaling;
        this.canvas.height *= scaling;
        this.context.transform(scaling, 0, 0, scaling, 0, 0);
    }
    startGame() {
        this.fixCanvasScaling();
        InputHandler.getHandler().registerListeners();
        Levels.registerLevels();
        this.current_level = Levels.LEVEL_1;
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
    gameLoop(timestamp) {
        const delta = (timestamp - this.previousTimestamp) / 1000;
        this.previousTimestamp = timestamp;
        this.current_level.update(delta);
        this.context.clearRect(0, 0, this.window_width, this.window_height);
        this.context.strokeText(Math.round(1 / delta).toString(), 50, 50);
        this.current_level.draw();
        InputHandler.getHandler().clearCurrentFrameBindings();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
}
Tetris.FPS = 60;
new Tetris();
//# sourceMappingURL=tetris.js.map