import BlockColor from "../color/blockColor.js";
import Tetris from "../main/tetris.js";
import SpriteFigure from "../sprite/spriteFigure.js";
import State from "../state/state.js";
import Effect from "./effect.js";
import {easeInOutQuad} from "./effectEasings.js";
import MoveEffect from "./moveEffect.js";

export default class StateChangeEffect extends Effect {

    private readonly targetState: State;
    private readonly blockSize = 160;

    private readonly moveDelay = 6;
    private readonly moveTime = 25;

    private readonly FIGURES = [
        new SpriteFigure([[0, 0], [0, 1], [0, 2], [1, 2]]),
        new SpriteFigure([[0, 1], [1, 1], [2, 1], [1, 0]]),
        new SpriteFigure([[0, 1], [1, 1], [1, 0], [2, 0]]),
        new SpriteFigure([[0, 0], [1, 0], [2, 0], [1, 1]]),
        new SpriteFigure([[0, 0], [1, 0], [1, 1], [1, 2]])
    ];

    private readonly POSITIONS: [number, number][] = [[0, 1], [2, 2], [1, 1], [0, 0], [3, 0]];

    public constructor(changeTo: State) {
        super(-1);
        this.targetState = changeTo;
        this.FIGURES.forEach((figure, index) => {
            figure.getColor().setTo(BlockColor.getRandomColor());
            figure.blockSize = this.blockSize;
            figure.outlineMode = "border";
            figure.setOutlineWidthBasedOnBlockSize();
            figure.x = this.POSITIONS[index][0] * this.blockSize;
            figure.y = this.POSITIONS[index][1] * this.blockSize - Tetris.instance.WINDOW_HEIGHT - figure.outlineWidth;
        });
    }

    private currentIndex = 0;
    private state: "moveIn" | "changeState" | "moveOut" | "interrupt" = "moveIn";

    public override onUpdate(delta: number) {
        switch(this.state) {
            case "moveIn": {
                this.moveIn(this.currentIndex);
                this.currentIndex++;
                if(this.currentIndex >= this.FIGURES.length) {
                    this.pause(this.moveTime);
                    this.state = "changeState";
                } else {
                    this.pause(this.moveDelay);
                }
            } break;
            case "changeState": {
                if(!this.targetState.isRunning()) {
                    this.targetState.begin();
                }
                this.state = "moveOut";
                this.currentIndex = 0;
            } break;
            case "moveOut": {
                this.moveOut(this.currentIndex);
                this.currentIndex++;
                if(this.currentIndex >= this.FIGURES.length) {
                    this.pause(this.moveTime);
                    this.state = "interrupt";
                } else {
                    this.pause(this.moveDelay);
                }
            } break;
            case "interrupt": {
                this.interruptWithCallback();
            } break;
        }
    }

    public override onDraw(context: CanvasRenderingContext2D) {
        this.FIGURES.forEach(figure => figure.draw(context));
    } 

    private moveIn(figureIndex: number) {
        const figure = this.FIGURES[figureIndex];
        const yPos = this.POSITIONS[figureIndex][1];
        const effect = new MoveEffect(figure, figure.x, yPos * this.blockSize, this.moveTime);
        effect.easing = easeInOutQuad;
    }

    private moveOut(figureIndex: number) {
        const figure = this.FIGURES[figureIndex];
        const yPos = this.POSITIONS[figureIndex][1] * this.blockSize + Tetris.instance.WINDOW_HEIGHT + figure.outlineWidth;
        const effect = new MoveEffect(figure, figure.x, yPos, this.moveTime);
        effect.easing = easeInOutQuad;
    }

    public override onEnd() {
        if(!this.targetState.isRunning()) {
            this.targetState.begin();
        }
    }

}