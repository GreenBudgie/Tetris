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
        return this.tetris;
    }
    getContext() {
        return this.context;
    }
    getField() {
        return this.field;
    }
    startGame() {
        //const scaling = window.devicePixelRatio;
        //context.scale(scaling, scaling);
        setInterval(this.process, 15);
    }
    process() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.field.draw();
    }
}
new Tetris();
//# sourceMappingURL=tetris.js.map