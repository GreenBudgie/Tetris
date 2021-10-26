import Tetris from "../game/tetris";
import Processable from "../util/processable";

/**
 * Effects provide an easy way of handling 
 * animations and transitions of any objects in the game
 */
export default abstract class Effect implements Processable {
    
    public isEnded: boolean = false;
    public time: number;
    private isPaused: boolean = false;

    public constructor(time: number) {
        this.time = time;
        this.onBegin();
    }

    public pause(): void {
        this.isPaused = true;
    }

    public resume(): void {
        this.isPaused = false;
    }

    public interrupt(): void {
        this.end();
    }   

    private end(): void {
        this.onEnd();
        this.isEnded = true;
    }

    public onBegin(): void {}
    public onEnd(): void {}

    public update(delta: number): void {
        if(this.isEnded) return;
        this.time -= delta * Tetris.FPS;
        if(this.time <= 0) {
            this.end();
        }
    }

    public draw(context: CanvasRenderingContext2D): void {
        if(this.isEnded) return;
    }
    
}