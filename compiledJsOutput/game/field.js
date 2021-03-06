import Tetris from "../main/tetris.js";
import GameProcess from "./gameProcess.js";
import Point from "../util/point.js";
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
    }
    static defaultSizeField() {
        return new Field(12, 20);
    }
    getRealFieldPosition() {
        return new Point(Math.round(Tetris.instance.WINDOW_WIDTH / 2 - this.getRealFieldWidth() / 2), Math.round(Tetris.instance.WINDOW_HEIGHT / 2 - this.getRealFieldHeight() / 2));
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
            const process = GameProcess.getCurrentProcess();
            process.points += this.sectionX;
            process.filledRows++;
            this.blocks = this.blocks.filter(block => block.section.y != y);
            for (const block of this.blocks) {
                if (block.section.y < y)
                    block.moveDown();
            }
        }
    }
    getBlockAt(sectionX, sectionY) {
        for (const block of this.blocks) {
            if (block.section.x == sectionX && block.section.x == sectionY)
                return block;
        }
        return null;
    }
    isSectionInside(section) {
        return section.x >= 0 && section.x < this.sectionX && section.y >= 0 && section.y < this.sectionsY;
    }
    isSectionInsideOrAbove(section) {
        return section.x >= 0 && section.x < this.sectionX && section.y < this.sectionsY;
    }
    update(delta) {
        if (this.fallingFigure != null) {
            this.fallingFigure.update(delta);
        }
        else {
            this.timeToCreateNewFigure -= delta * Tetris.FPS;
            if (this.timeToCreateNewFigure <= 0) {
                const process = GameProcess.getCurrentProcess();
                process.createNextFigureAtField();
                process.selectNextFigure();
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
        const startPosition = this.getRealFieldPosition();
        context.strokeStyle = "rgb(189, 189, 189)";
        context.lineWidth = 1;
        context.beginPath();
        for (let xSection = 0; xSection <= this.sectionX; xSection++) {
            context.moveTo(startPosition.x + xSection * this.realSectionSize + 0.5, startPosition.y);
            context.lineTo(startPosition.x + xSection * this.realSectionSize + 0.5, startPosition.y + this.getRealFieldHeight());
        }
        for (let ySection = 0; ySection <= this.sectionsY; ySection++) {
            context.moveTo(startPosition.x, startPosition.y + ySection * this.realSectionSize + 0.5);
            context.lineTo(startPosition.x + this.getRealFieldWidth(), startPosition.y + ySection * this.realSectionSize + 0.5);
        }
        context.closePath();
        context.stroke();
    }
    drawBlocks(context) {
        this.blocks.forEach(block => block.draw(context));
    }
}
//# sourceMappingURL=field.js.map