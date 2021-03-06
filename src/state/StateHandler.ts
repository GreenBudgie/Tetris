import Processable from "../util/processable.js";
import State from "./state.js";
import StateGame from "./stateGame.js";
import StateMenu from "./stateMenu.js";

export default class StateHandler implements Processable {

    public readonly GAME: StateGame = new StateGame();
    public readonly MENU: StateMenu = new StateMenu();

    private _currentState: State;
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