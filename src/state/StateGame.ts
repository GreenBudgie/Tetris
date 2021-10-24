import Level from "../level/level.js";
import Levels from "../level/levels.js";
import State from "./state.js";

export default class StateGame extends State {

    private _level: Level;

    public constructor() {
        super();
        this._level = Levels.LEVEL_1;
    }

    public get level() {
        return this._level;
    }

    public set level(level: Level) {
        this._level = level;
    }

    public update(delta: number): void {
        this._level.update(delta);
    }

    public draw(context: CanvasRenderingContext2D): void {
        this._level.draw(context);
    }
    
}