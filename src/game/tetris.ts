import InputHandler from "./input_handler.js";
import Level from "../level/level.js";
import Levels from "../level/levels.js";

export default class Tetris {

	public static readonly FPS: number = 60;

	public readonly canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
	public readonly context: CanvasRenderingContext2D = this.canvas.getContext("2d") as CanvasRenderingContext2D;

	public readonly window_width: number = this.canvas.width;
	public readonly window_height: number = this.canvas.height;

	public current_level: Level;

	private static _instance: Tetris;

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

	private startGame() {
		this.fixCanvasScaling();
		InputHandler.getHandler().registerListeners();
		Levels.registerLevels();
		this.current_level = Levels.LEVEL_1;
		requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
	}

	private previousTimestamp = 0;

	private gameLoop(timestamp: number): void {
		const delta = (timestamp - this.previousTimestamp) / 1000;
		this.previousTimestamp = timestamp;

		this.current_level.update(delta);

		this.context.clearRect(0, 0, this.window_width, this.window_height);
		this.context.strokeText(Math.round(1 / delta).toString(), 50, 50);
		this.current_level.draw();

		InputHandler.getHandler().clearCurrentFrameBindings();

		requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
	}

}

new Tetris();