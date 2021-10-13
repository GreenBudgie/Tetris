import Field from "./field.js";

export default class Tetris {

  public static readonly canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
  public static readonly context: CanvasRenderingContext2D = Tetris.canvas.getContext("2d") as CanvasRenderingContext2D;
  public static readonly field: Field = new Field();

  public static readonly window_width: number = Tetris.canvas.width;
  public static readonly window_height: number = Tetris.canvas.height;

  constructor() {
    Tetris.startGame();
  }

  private static startGame(): void {
    setInterval(() => Tetris.process(), 15);
  }

  private static process(): void {
    Tetris.context.clearRect(0, 0, Tetris.window_width, Tetris.window_height);
    Tetris.field.draw();
  }
}

new Tetris();