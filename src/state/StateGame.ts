import GameProcess from "../game/gameProcess.js";
import Levels from "../game/levels.js";
import State from "./state.js";

export default class StateGame extends State {

    public constructor() {
        super();
        GameProcess.initiate(Levels.LEVEL_1);
    }

    public override onEnd() {
        GameProcess.terminate();
    }

    public update(delta: number): void {
        GameProcess.getCurrentProcess().update(delta);
    }

    public draw(context: CanvasRenderingContext2D): void {
        GameProcess.getCurrentProcess().draw(context);
    }
    
}