import Field from "./field.js";
export default class Tetris {
    constructor() {
        Tetris.startGame();
    }
    static startGame() {
        setInterval(() => Tetris.process(), 15);
    }
    static process() {
        Tetris.context.clearRect(0, 0, Tetris.window_width, Tetris.window_height);
        Tetris.field.draw();
    }
}
Tetris.canvas = document.getElementById('canvas');
Tetris.context = Tetris.canvas.getContext("2d");
Tetris.field = new Field();
Tetris.window_width = Tetris.canvas.width;
Tetris.window_height = Tetris.canvas.height;
new Tetris();
//# sourceMappingURL=tetris.js.map