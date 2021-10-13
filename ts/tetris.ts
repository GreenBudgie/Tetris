import Field from "./field.js";

export default class Tetris {

  private static tetris: Tetris;
  private readonly canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  private readonly field: Field = new Field();

  constructor() {
    Tetris.tetris = this;
    this.startGame();
  }

  public static getTetris() {
    return Tetris.tetris;
  }

  public getContext(): CanvasRenderingContext2D {
    return this.context;
  }

  public getField(): Field {
    return this.field;
  }

  private fixCanvasContextScaling() {
    const scaling = 1;
    this.canvas.style.width = this.canvas.offsetWidth + "px";
    this.canvas.style.height = this.canvas.offsetHeight + "px";
    this.canvas.width = this.canvas.offsetWidth * scaling;
    this.canvas.height = this.canvas.offsetHeight * scaling;
    this.context.setTransform(scaling, 0, 0, scaling, 0, 0);
  }

  private startGame(): void {
    //this.fixCanvasContextScaling();
    setInterval(() => this.process(), 15);
  }

  private process(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.field.draw();
  }
}

new Tetris();