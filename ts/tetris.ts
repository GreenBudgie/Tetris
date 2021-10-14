import Field from "./field.js";
import { Figure } from "./figure.js";

export default class Tetris {

  public static readonly canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
  public static readonly context: CanvasRenderingContext2D = Tetris.canvas.getContext("2d") as CanvasRenderingContext2D;
  public static readonly field: Field = new Field();

  public static readonly window_width: number = Tetris.canvas.width;
  public static readonly window_height: number = Tetris.canvas.height;

  private static figure = Figure.createByRelativeBlockSections(
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 2]
  );

  constructor() {
    Tetris.startGame();
  }

  private static fixCanvasScaling() {
    const scaling = window.devicePixelRatio;
    Tetris.canvas.style.width = Tetris.canvas.offsetWidth + "px";
    Tetris.canvas.style.height = Tetris.canvas.offsetHeight + "px";
    Tetris.canvas.width *= scaling;
    Tetris.canvas.height *= scaling;
    Tetris.context.transform(scaling, 0, 0, scaling, 0, 0);
  }

  private static startGame(): void {
    this.fixCanvasScaling();
    setInterval(() => Tetris.process(), 15);
  }

  private static process(): void {
    Tetris.context.clearRect(0, 0, Tetris.window_width, Tetris.window_height);
    Tetris.field.draw();
    Tetris.figure.draw();
  }
}

new Tetris();