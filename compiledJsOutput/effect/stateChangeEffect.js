import BlockColor from "../color/blockColor.js";
import Tetris from "../main/tetris.js";
import SpriteFigure from "../sprite/spriteFigure.js";
import Point, { PointArray } from "../util/point.js";
import Effect from "./effect.js";
import { easeInOutQuad } from "./effectEasings.js";
import MoveEffect from "./moveEffect.js";
export default class StateChangeEffect extends Effect {
    constructor(changeTo) {
        super(-1);
        this.blockSize = 160;
        this.moveDelay = 6;
        this.moveTime = 25;
        this.FIGURES = [
            new SpriteFigure(PointArray.begin(0, 0).add(0, 1).add(0, 2).add(1, 2).build()),
            new SpriteFigure(PointArray.begin(0, 1).add(1, 1).add(2, 1).add(1, 0).build()),
            new SpriteFigure(PointArray.begin(0, 1).add(1, 1).add(1, 0).add(2, 0).build()),
            new SpriteFigure(PointArray.begin(0, 0).add(1, 0).add(2, 0).add(1, 1).build()),
            new SpriteFigure(PointArray.begin(0, 0).add(1, 0).add(1, 1).add(1, 2).build())
        ];
        this.POSITIONS = PointArray.begin(0, 1).add(2, 2).add(1, 1).add(0, 0).add(3, 0).build();
        this.currentIndex = 0;
        this.state = "moveIn";
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
    onUpdate(delta) {
        switch (this.state) {
            case "moveIn":
                {
                    this.moveIn(this.currentIndex);
                    this.currentIndex++;
                    if (this.currentIndex >= this.FIGURES.length) {
                        this.pause(this.moveTime);
                        this.state = "changeState";
                    }
                    else {
                        this.pause(this.moveDelay);
                    }
                }
                break;
            case "changeState":
                {
                    if (!this.targetState.isRunning()) {
                        this.targetState.begin();
                    }
                    this.state = "moveOut";
                    this.currentIndex = 0;
                }
                break;
            case "moveOut":
                {
                    this.moveOut(this.currentIndex);
                    this.currentIndex++;
                    if (this.currentIndex >= this.FIGURES.length) {
                        this.pause(this.moveTime);
                        this.state = "interrupt";
                    }
                    else {
                        this.pause(this.moveDelay);
                    }
                }
                break;
            case "interrupt":
                {
                    this.interrupt();
                }
                break;
        }
    }
    onDraw(context) {
        this.FIGURES.forEach(figure => figure.draw(context));
    }
    moveIn(figureIndex) {
        const figure = this.FIGURES[figureIndex];
        const yPos = this.POSITIONS[figureIndex].y;
        const effect = new MoveEffect(figure, new Point(figure.position.x, yPos * this.blockSize), this.moveTime);
        effect.easing = easeInOutQuad;
    }
    moveOut(figureIndex) {
        const figure = this.FIGURES[figureIndex];
        const yPos = this.POSITIONS[figureIndex].y * this.blockSize + Tetris.instance.WINDOW_HEIGHT + figure.outlineWidth;
        const effect = new MoveEffect(figure, new Point(figure.position.x, yPos), this.moveTime);
        effect.easing = easeInOutQuad;
    }
    onEnd() {
        if (!this.targetState.isRunning()) {
            this.targetState.begin();
        }
    }
}
//# sourceMappingURL=stateChangeEffect.js.map