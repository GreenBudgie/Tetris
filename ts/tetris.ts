import Field from "./field.js";
import Figure from "./figure.js";
import InputHandler from "./input_handler.js";

export default class Tetris {

  public readonly canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
  public readonly context: CanvasRenderingContext2D = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  public readonly field: Field = new Field();

  public readonly window_width: number = this.canvas.width;
  public readonly window_height: number = this.canvas.height;

  private static _instance: Tetris;

  private figure = Figure.createByRelativeBlockSections(
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 2]
  );

  constructor() {
    Tetris._instance = this;
    this.startGame();
  }

  static get instance(): Tetris {
    return this._instance;
  }

  private fixCanvasScaling() {
    const scaling = window.devicePixelRatio;
    this.canvas.style.width = this.canvas.offsetWidth + "px";
    this.canvas.style.height = this.canvas.offsetHeight + "px";
    this.canvas.width *= scaling;
    this.canvas.height *= scaling;
    this.context.transform(scaling, 0, 0, scaling, 0, 0);
  }

  private startGame(): void {
    this.fixCanvasScaling();
    InputHandler.getHandler().registerListeners();
    setInterval(() => this.process(), 15);
  }

  private process(): void {
    this.context.clearRect(0, 0, this.window_width, this.window_height);
    this.field.draw();
    this.figure.draw();
  }

}

new Tetris();