import Field from "./field.js";
import { Figure } from "./figure.js";
export default class Tetris {
    constructor() {
        Tetris.startGame();
    }
    static startGame() {
        setInterval(() => Tetris.process(), 1000);
    }
    static process() {
        Tetris.context.clearRect(0, 0, Tetris.window_width, Tetris.window_height);
        Tetris.field.draw();
        Tetris.figure.draw();
        Tetris.figure.fall();
    }
}
Tetris.canvas = document.getElementById('canvas');
Tetris.context = Tetris.canvas.getContext("2d");
Tetris.field = new Field();
Tetris.window_width = Tetris.canvas.width;
Tetris.window_height = Tetris.canvas.height;
Tetris.figure = Figure.createByRelativeBlockSections([0, 0], [1, 0], [1, 1]);
new Tetris();
//# sourceMappingURL=tetris.js.map