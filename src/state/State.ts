import Processable from "../util/Processable";
import StateHandler from "./StateHandler";

export default abstract class State implements Processable {

    public abstract update(delta: number): void;

    public abstract draw(context: CanvasRenderingContext2D): void;

    public onBegin(): void {};
    public onEnd(): void {};

    public begin(): void {
        StateHandler.getHandler().setCurrentState(this);
        this.onBegin();
    }

    public end(): void {
        this.onEnd();
    }

}