import Field from "./field.js";

export default class Tetris {

  private static tetris: Tetris;
  private canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
  private context: CanvasRenderingContext2D = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  private field: Field = new Field();

  constructor() {
    Tetris.tetris = this;
    this.startGame();
  }

  public static getTetris() {
    return this.tetris;
  }

  public getContext(): CanvasRenderingContext2D {
    return this.context;
  }

  public getField(): Field {
    return this.field;
  }

  private startGame(): void {
    //const scaling = window.devicePixelRatio;
    //context.scale(scaling, scaling);
    setInterval(this.process, 15);
  }

  private process(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.field.draw();
  }
}

new Tetris();