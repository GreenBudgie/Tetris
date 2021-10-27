import Tetris from "../game/tetris.js";
import Processable from "../util/processable.js";
import EffectHandler from "./effectHandler.js";

/**
 * Effects provide an easy way of handling 
 * animations and transitions of any objects in the game
 */
export default class Effect implements Processable {
    
    public readonly maxTime: number;
    public time: number;

    private _isActive: boolean = true;
    private _isPaused: boolean = false;
    private _progress: number = 0;

    public onEnd: () => void = () => {};

    public constructor(time: number) {
        this.maxTime = time;
        this.time = time;
        EffectHandler.getHandler().activeEffects.push(this);
    }

    public get progress(): number {
        return this._progress;
    }

    public get isPaused(): boolean {
        return this._isPaused;
    }

    public get isActive(): boolean {
        return this._isActive;
    }

    public pause(): void {
        this._isPaused = true;
    }

    public resume(): void {
        this._isPaused = false;
    }

    public interrupt(): void {
        this.end();
    }

    private end(): void {
        this.onEnd();
        this._isActive = false;
    }

    public update(delta: number): void {
        if(!this._isActive) return;
        this.time -= delta * Tetris.FPS;
        this._progress = 1 - this.time / this.maxTime;
        if(this.time <= 0) {
            this.end();
        }
    }

    public draw(context: CanvasRenderingContext2D): void {
        if(!this._isActive) return;
    }
    
}