import InputHandler from "./inputHandler.js";
import Levels from "../level/levels.js";
import StateHandler from "../state/stateHandler.js";
import EffectHandler from "../effect/effectHandler.js";

export default class Tetris {

	public static readonly FPS: number = 60;

	public readonly canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
	public readonly context: CanvasRenderingContext2D = this.canvas.getContext("2d") as CanvasRenderingContext2D;

	public readonly WINDOW_WIDTH: number = this.canvas.width;
	public readonly WINDOW_HEIGHT: number = this.canvas.height;

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
		StateHandler.getHandler().MENU.begin();
		requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
	}

	private previousTimestamp = 0;

	private gameLoop(timestamp: number): void {
		const delta = (timestamp - this.previousTimestamp) / 1000;
		this.previousTimestamp = timestamp;

		StateHandler.getHandler().currentState.update(delta);

		this.context.clearRect(0, 0, this.WINDOW_WIDTH, this.WINDOW_HEIGHT);
		this.drawFps(Math.round(1 / delta).toString());
		StateHandler.getHandler().currentState.draw(this.context);

		EffectHandler.getHandler().update(delta);
		EffectHandler.getHandler().draw(this.context);

		InputHandler.getHandler().clearCurrentFrameBindings();

		requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
	}

	private drawFps(fps: string) {
		this.context.font = "20px ft_default";
        this.context.fillStyle = "gray";
        this.context.textBaseline = "top";
        this.context.textAlign = "left";
        this.context.fillText(fps, 5, 0);
	}

}

new Tetris();