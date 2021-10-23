import Level from "../level/level";
import State from "./State";

export default class StateGame extends State {

    private _level: Level;

    public get level() {
        return this._level;
    }

    public set level(level: Level) {
        this._level = level;
    }

    public update(delta: number): void {
        
    }

    public draw(context: CanvasRenderingContext2D): void {
        
    }
    
}