import Processable from "../util/Processable";
import State from "./State";
import StateGame from "./StateGame";

export default class StateHandler implements Processable {

    public readonly GAME: State = new StateGame();

    private currentState: State = this.GAME;
    private static instance: StateHandler = null;

    private constructor() {}

    public update(delta: number): void {
        this.currentState.update(delta);
    }

    public draw(context: CanvasRenderingContext2D): void {
        this.currentState.draw(context);
    }

    public setCurrentState(state: State) {
        this.currentState = state;
    }

    public static getHandler(): StateHandler {
        if(StateHandler.instance == null) StateHandler.instance = new StateHandler();
        return StateHandler.instance;
    }

}