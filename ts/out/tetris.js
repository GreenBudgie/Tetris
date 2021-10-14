import Field from "./field.js";
import { Figure } from "./figure.js";
export default class Tetris {
    constructor() {
        Tetris.startGame();
    }
    static fixCanvasScaling() {
        const scaling = window.devicePixelRatio;
        let initWidth = Tetris.canvas.offsetWidth;
        let initHeight = Tetris.canvas.offsetHeight;
        Tetris.canvas.width = initWidth * scaling;
        Tetris.canvas.height = initHeight * scaling;
        Tetris.canvas.style.width = initWidth + "px";
        Tetris.canvas.style.height = initHeight + "px";
        Tetris.context.transform(scaling, 0, 0, scaling, 0, 0);
    }
    static startGame() {
        this.fixCanvasScaling();
        setInterval(() => Tetris.process(), 15);
    }
    static process() {
        Tetris.context.clearRect(0, 0, Tetris.window_width, Tetris.window_height);
        Tetris.field.draw();
        Tetris.figure.draw();
    }
}
Tetris.canvas = document.getElementById('canvas');
Tetris.context = Tetris.canvas.getContext("2d");
Tetris.field = new Field();
Tetris.window_width = Tetris.canvas.width;
Tetris.window_height = Tetris.canvas.height;
Tetris.figure = Figure.createByRelativeBlockSections([0, 0], [1, 0], [1, 1], [2, 2]);
new Tetris();
//# sourceMappingURL=tetris.js.map