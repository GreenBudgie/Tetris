import Tetris from "../main/tetris.js";
import Processable from "../util/processable.js";
import {EasingFunction, noEasing} from "./effectEasings.js";
import EffectHandler from "./effectHandler.js";

/**
 * Effects provide an easy way of handling 
 * animations and transitions of any objects in the game
 */
export default class Effect implements Processable {
    
    public readonly maxTime: number;
    public time: number;

    private _callEndingFunction: boolean = true;
    private _isInfinite: boolean = false;
    private _isActive: boolean = true;
    private _isPaused: boolean = false;
    private _pauseDelay: number = 0;
    private _progress: number = 0;

    public callback: () => void = () => {};
    public easing: EasingFunction = noEasing;

    public constructor(time: number, initialDelay?: number) {
        this.maxTime = time;
        this.time = time;
        if(time <= 0) this._isInfinite = true;
        if(initialDelay != null && initialDelay != undefined) this.pause(initialDelay);
        EffectHandler.getHandler().activeEffects.push(this);
    }

    public get callEndingFunction(): boolean {
        return this._callEndingFunction;
    }

    public set callEndingFunction(value: boolean) {
        this._callEndingFunction = value;
    }

    public get isInfinite(): boolean {
        return this._isInfinite;
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

    /**
     * Sets all the variables this effect handles to their target values.
     * May be cancelled when the effect interrupts.
     */
    public setTargetValues(): void {}
    
    /**
     * Called when effect has ended or interrupted
     */
    public onEnd(): void {}
    public onUpdate(delta: number): void {}
    public onDraw(context: CanvasRenderingContext2D): void {}

    /**
     * Returns the progress of the effect clamped between specified values
     * @example If the real progress is 0.5, min = 1, max = 3, this will return 2
     * @param min Minimum value
     * @param max Maximum value
     * @returns A progress value between min and max
     */
    public progressClamped(min: number, max: number): number {
        return (max - min) * this.progress + min; 
    }

    /**
     * Applies the easing function to the progress clamped between specified values
     * @param min Minimum value
     * @param max Maximum value
     * @param easingFunction A function to apply
     * @returns Eased and clamped progress
     */
    public progressEasedClamped(min: number, max: number, easingFunction: EasingFunction): number {
        return easingFunction(this.progress, min, max - min, 1);
    }

    /**
     * Applies the easing function to the progress 
     * @param easingFunction A function to apply
     * @returns Eased progress
     */
    public progressEased(easingFunction: EasingFunction): number {
        return easingFunction(this.progress, 0, 1, 1);
    }

    public pause(delay?: number): void {
        this._isPaused = true;
        if(delay != null && delay != undefined) this._pauseDelay = delay; else this._pauseDelay = -1;
    }

    public resume(): void {
        this._isPaused = false;
    }

    /**
     * Interrupts the effect before its progress reaches 1
     * @param setTargetValues Whether to set all the effect variables to their target values (false by default)
     * @param callback Whether to invoke callback function of this effect (false by default)
     */
    public interrupt(setTargetValues: boolean = false, callback: boolean = false): void {
        if(!callback) this.callback = () => {};
        if(!setTargetValues) this.setTargetValues = () => {};
        this.end();
    }

    private end(): void {
        if(!this.isActive) return;
        this.onEnd();
        this.setTargetValues();
        this.callback();
        this._isActive = false;
    }

    public update(delta: number): void {
        if(!this._isActive) return;
        if(this._isPaused) {
            if(this._pauseDelay != -1) {
                this._pauseDelay--;
                if(this._pauseDelay <= 0) this.resume();
            }
        } else {
            if(!this._isInfinite) {
                this.time -= delta * Tetris.FPS;
                this._progress = this.easing(1 - this.time / this.maxTime, 0, 1, 1);
            }
            if(!this._isInfinite && this.time <= 0) {
                this.end();
            } else {
                this.onUpdate(delta);
            }
        }
    }

    public draw(context: CanvasRenderingContext2D): void {
        if(!this._isActive) return;
        this.onDraw(context);
    }

}