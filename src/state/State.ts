import Processable from "../util/processable.js";
import StateHandler from "./stateHandler.js";

export default abstract class State implements Processable {

    public abstract update(delta: number): void;

    public abstract draw(context: CanvasRenderingContext2D): void;

    public onBegin(): void {};
    public onEnd(): void {};

    public begin(): void {
        StateHandler.getHandler().currentState = this;
        this.onBegin();
    }

    public end(): void {
        this.onEnd();
    }

    public isRunning(): boolean {
        return this == StateHandler.getHandler().currentState;
    }

}