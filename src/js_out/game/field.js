import StateHandler from "../state/StateHandler.js";
import { Figures } from "./Figure.js";
import Tetris from "./Tetris.js";
/**
 * A field is a game element that stores and renders all the blocks and figures inside it
 */
export default class Field {
    constructor(sectionsX, sectionsY) {
        /**
         * The actual size of each section measured in pixels
         */
        this.realSectionSize = 28;
        /**
         * The amount of sections above the playable area
         */
        this.limitSections = 3;
        this.blocks = [];
        this.maxTimeToCreateNewFigure = 15;
        this.timeToCreateNewFigure = this.maxTimeToCreateNewFigure;
        this.sectionX = sectionsX;
        this.sectionsY = sectionsY;
        this.createFallingFigure(Figures.createRandomFigure());
    }
    static defaultSizeField() {
        return new Field(12, 20);
    }
    getRealFieldX() {
        return Math.round(Tetris.instance.WINDOW_WIDTH / 2 - this.getRealFieldWidth() / 2);
    }
    getRealFieldY() {
        return Math.round(Tetris.instance.WINDOW_HEIGHT / 2 - this.getRealFieldHeight() / 2);
    }
    getRealFieldWidth() {
        return this.realSectionSize * this.sectionX;
    }
    getRealFieldHeight() {
        return this.realSectionSize * this.sectionsY;
    }
    createFallingFigure(figure) {
        const halfFigureWidth = Math.floor(figure.getCurrentWidth() / 2);
        const halfFieldWidth = Math.floor(this.sectionX / 2);
        figure.moveNoRestrictions(halfFieldWidth - halfFigureWidth, 0);
        this.fallingFigure = figure;
    }
    landFigure() {
        for (const figureBlock of this.fallingFigure.blocks) {
            this.blocks.push(figureBlock.toFieldBlock());
        }
        this.fallingFigure = null;
        this.timeToCreateNewFigure = this.maxTimeToCreateNewFigure;
        this.removeFullRowsAndGrantPoints();
    }
    removeFullRowsAndGrantPoints() {
        row_loop: for (let y = 0; y < this.sectionsY; y++) {
            for (let x = 0; x < this.sectionX; x++) {
                const fieldBlock = this.getBlockAt(x, y);
                if (fieldBlock == null) {
                    continue row_loop;
                }
            }
            const level = StateHandler.getHandler().GAME.level;
            level.points += this.sectionX;
            level.filled_rows++;
            this.blocks = this.blocks.filter(block => block.getFieldSectionY() != y);
            for (const block of this.blocks) {
                if (block.getFieldSectionY() < y)
                    block.moveDown();
            }
        }
    }
    getBlockAt(sectionX, sectionY) {
        for (const block of this.blocks) {
            if (block.getFieldSectionX() == sectionX && block.getFieldSectionY() == sectionY)
                return block;
        }
        return null;
    }
    isSectionInside(sectionX, sectionY) {
        return sectionX >= 0 && sectionX < this.sectionX && sectionY >= 0 && sectionY < this.sectionsY;
    }
    update(delta) {
        if (this.fallingFigure != null) {
            this.fallingFigure.update(delta);
        }
        else {
            this.timeToCreateNewFigure -= delta * Tetris.FPS;
            if (this.timeToCreateNewFigure <= 0) {
                const level = StateHandler.getHandler().GAME.level;
                level.createNextFigureAtField();
                level.selectNextFigure();
            }
        }
    }
    draw(context) {
        this.drawSections(context);
        this.drawBlocks(context);
        if (this.fallingFigure != null)
            this.fallingFigure.draw(context);
    }
    drawSections(context) {
        const startX = this.getRealFieldX();
        const startY = this.getRealFieldY();
        context.strokeStyle = "rgb(189, 189, 189)";
        context.lineWidth = 1;
        context.beginPath();
        for (let xSection = 0; xSection <= this.sectionX; xSection++) {
            context.moveTo(startX + xSection * this.realSectionSize + 0.5, startY);
            context.lineTo(startX + xSection * this.realSectionSize + 0.5, startY + this.getRealFieldHeight());
        }
        for (let ySection = 0; ySection <= this.sectionsY; ySection++) {
            context.moveTo(startX, startY + ySection * this.realSectionSize + 0.5);
            context.lineTo(startX + this.getRealFieldWidth(), startY + ySection * this.realSectionSize + 0.5);
        }
        context.closePath();
        context.stroke();
    }
    drawBlocks(context) {
        this.blocks.forEach(block => block.draw(context));
    }
}
//# sourceMappingURL=Field.js.map