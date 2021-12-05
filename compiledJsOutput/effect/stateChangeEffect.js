import BlockColor from "../color/blockColor.js";
import Tetris from "../main/tetris.js";
import SpriteFigure from "../sprite/spriteFigure.js";
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
            new SpriteFigure([[0, 0], [0, 1], [0, 2], [1, 2]]),
            new SpriteFigure([[0, 1], [1, 1], [2, 1], [1, 0]]),
            new SpriteFigure([[0, 1], [1, 1], [1, 0], [2, 0]]),
            new SpriteFigure([[0, 0], [1, 0], [2, 0], [1, 1]]),
            new SpriteFigure([[0, 0], [1, 0], [1, 1], [1, 2]])
        ];
        this.POSITIONS = [[0, 1], [2, 2], [1, 1], [0, 0], [3, 0]];
        this.currentIndex = 0;
        this.state = "moveIn";
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
                    this.interruptWithCallback();
                }
                break;
        }
    }
    onDraw(context) {
        this.FIGURES.forEach(figure => figure.draw(context));
    }
    moveIn(figureIndex) {
        const figure = this.FIGURES[figureIndex];
        const yPos = this.POSITIONS[figureIndex][1];
        const effect = new MoveEffect(figure, figure.x, yPos * this.blockSize, this.moveTime);
        effect.easing = easeInOutQuad;
    }
    moveOut(figureIndex) {
        const figure = this.FIGURES[figureIndex];
        const yPos = this.POSITIONS[figureIndex][1] * this.blockSize + Tetris.instance.WINDOW_HEIGHT + figure.outlineWidth;
        const effect = new MoveEffect(figure, figure.x, yPos, this.moveTime);
        effect.easing = easeInOutQuad;
    }
    onEnd() {
        if (!this.targetState.isRunning()) {
            this.targetState.begin();
        }
    }
}
//# sourceMappingURL=stateChangeEffect.js.map