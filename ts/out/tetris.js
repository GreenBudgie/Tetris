import Field from "./field.js";
const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");
const field = new Field();
function startGame() {
    canvas.style.width = `${field.getRealCanvasWidth()}px`;
    canvas.style.height = `${field.getRealCanvasHeight()}px`;
    setInterval(process, 1000 / 30);
}
function process() {
}
startGame();
//# sourceMappingURL=tetris.js.map