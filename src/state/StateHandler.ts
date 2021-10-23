import Processable from "../util/Processable.js";
import State from "./State.js";
import StateGame from "./StateGame.js";

export default class StateHandler implements Processable {

    public readonly GAME: StateGame = new StateGame();

    private _currentState: State = this.GAME;
    private static instance: StateHandler = null;

    private constructor() {}

    public update(delta: number): void {
        this._currentState.update(delta);
    }

    public draw(context: CanvasRenderingContext2D): void {
        this._currentState.draw(context);
    }

    public get currentState(): State {
        return this._currentState;
    }

    public set currentState(state: State) {
        this._currentState = state;
    }

    public static getHandler(): StateHandler {
        if(StateHandler.instance == null) StateHandler.instance = new StateHandler();
        return StateHandler.instance;
    }

}