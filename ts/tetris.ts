import Field from "./field.js";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;
const field: Field = new Field();

function startGame(): void {
  canvas.style.width = `${field.getRealCanvasWidth()}px`;
  canvas.style.height = `${field.getRealCanvasHeight()}px`;
  setInterval(process, 1000 / 30);
}

function process(): void {
  
}

startGame();