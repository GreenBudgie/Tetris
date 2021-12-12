import BlockColor from "../color/blockColor.js";
import Tetris from "../main/tetris.js";
import SpriteFigure from "../sprite/spriteFigure.js";
import State from "../state/state.js";
import Point, {PointArray} from "../util/point.js";
import Effect from "./effect.js";
import {easeInOutQuad} from "./effectEasings.js";
import MoveEffect from "./moveEffect.js";

export default class StateChangeEffect extends Effect {

    private readonly targetState: State;
    private readonly blockSize = 160;

    private readonly moveDelay = 6;
    private readonly moveTime = 25;

    private readonly FIGURES = [
        new SpriteFigure(PointArray.begin(0, 0).add(0, 1).add(0, 2).add(1, 2).build()),
        new SpriteFigure(PointArray.begin(0, 1).add(1, 1).add(2, 1).add(1, 0).build()),
        new SpriteFigure(PointArray.begin(0, 1).add(1, 1).add(1, 0).add(2, 0).build()),
        new SpriteFigure(PointArray.begin(0, 0).add(1, 0).add(2, 0).add(1, 1).build()),
        new SpriteFigure(PointArray.begin(0, 0).add(1, 0).add(1, 1).add(1, 2).build())
    ];

    private readonly POSITIONS: Point[] = PointArray.begin(0, 1).add(2, 2).add(1, 1).add(0, 0).add(3, 0).build();

    public constructor(changeTo: State) {
        super(-1);
        this.targetState = changeTo;
        this.FIGURES.forEach((figure, index) => {
            figure.getColor().setTo(BlockColor.getRandomColor());
            figure.blockSize = this.blockSize;
            figure.outlineMode = "border";
            figure.setOutlineWidthBasedOnBlockSize();
            figure.position.x = this.POSITIONS[index].x * this.blockSize;
            figure.position.y = this.POSITIONS[index].y * this.blockSize - Tetris.instance.WINDOW_HEIGHT - figure.outlineWidth;
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
                this.interrupt();
            } break;
        }
    }

    public override onDraw(context: CanvasRenderingContext2D) {
        this.FIGURES.forEach(figure => figure.draw(context));
    } 

    private moveIn(figureIndex: number) {
        const figure = this.FIGURES[figureIndex];
        const yPos = this.POSITIONS[figureIndex].y;
        const effect = new MoveEffect(figure, new Point(figure.position.x, yPos * this.blockSize), this.moveTime);
        effect.easing = easeInOutQuad;
    }

    private moveOut(figureIndex: number) {
        const figure = this.FIGURES[figureIndex];
        const yPos = this.POSITIONS[figureIndex].y * this.blockSize + Tetris.instance.WINDOW_HEIGHT + figure.outlineWidth;
        const effect = new MoveEffect(figure, new Point(figure.position.x, yPos), this.moveTime);
        effect.easing = easeInOutQuad;
    }

    public override onEnd() {
        if(!this.targetState.isRunning()) {
            this.targetState.begin();
        }
    }

}