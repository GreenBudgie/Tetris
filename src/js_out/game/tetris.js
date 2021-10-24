import InputHandler from "./InputHandler.js";
import Levels from "../level/Levels.js";
import StateHandler from "../state/StateHandler.js";
export default class Tetris {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
        this.WINDOW_WIDTH = this.canvas.width;
        this.WINDOW_HEIGHT = this.canvas.height;
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
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
    gameLoop(timestamp) {
        const delta = (timestamp - this.previousTimestamp) / 1000;
        this.previousTimestamp = timestamp;
        StateHandler.getHandler().currentState.update(delta);
        this.context.clearRect(0, 0, this.WINDOW_WIDTH, this.WINDOW_HEIGHT);
        this.drawFps(Math.round(1 / delta).toString());
        StateHandler.getHandler().currentState.draw(this.context);
        InputHandler.getHandler().clearCurrentFrameBindings();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
    drawFps(fps) {
        this.context.font = "20px ft_default";
        this.context.fillStyle = "gray";
        this.context.textBaseline = "top";
        this.context.textAlign = "left";
        this.context.fillText(fps, 5, 0);
    }
}
Tetris.FPS = 60;
new Tetris();
//# sourceMappingURL=Tetris.js.map