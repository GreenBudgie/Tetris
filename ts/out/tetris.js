import Field from "./field.js";
import InputHandler from "./input_handler.js";
export default class Tetris {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext("2d");
        this.field = new Field();
        this.window_width = this.canvas.width;
        this.window_height = this.canvas.height;
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
        setInterval(() => this.process(), 15);
    }
    process() {
        this.field.update();
        this.context.clearRect(0, 0, this.window_width, this.window_height);
        this.field.draw();
        InputHandler.getHandler().clearCurrentFrameBindings();
    }
}
new Tetris();
//# sourceMappingURL=tetris.js.map