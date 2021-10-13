import Field from "./field.js";
export default class Tetris {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext("2d");
        this.field = new Field();
        Tetris.tetris = this;
        this.startGame();
    }
    static getTetris() {
        return Tetris.tetris;
    }
    getContext() {
        return this.context;
    }
    getField() {
        return this.field;
    }
    fixCanvasContextScaling() {
        const scaling = 1;
        this.canvas.style.width = this.canvas.offsetWidth + "px";
        this.canvas.style.height = this.canvas.offsetHeight + "px";
        this.canvas.width = this.canvas.offsetWidth * scaling;
        this.canvas.height = this.canvas.offsetHeight * scaling;
        this.context.setTransform(scaling, 0, 0, scaling, 0, 0);
    }
    startGame() {
        //this.fixCanvasContextScaling();
        setInterval(() => this.process(), 15);
    }
    process() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.field.draw();
    }
}
new Tetris();
//# sourceMappingURL=tetris.js.map