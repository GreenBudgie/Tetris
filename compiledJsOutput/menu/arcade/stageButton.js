import ArcadeHandler from "./arcadeHandler.js";
export default class StageButton {
    constructor() {
    }
    get x() {
        return this._x;
    }
    set x(x) {
        this._x = x;
    }
    get y() {
        return this._y;
    }
    set y(y) {
        this._y = y;
    }
    getColor() {
        return this.color;
    }
    update(delta) {
    }
    draw(context) {
        for (const block of this.blocks) {
            block.draw(context);
        }
    }
    setSection(sectionX, sectionY) {
        this.sectionX = sectionX;
        this.sectionY = sectionY;
    }
    setCenterSection(centerSectionX, centerSectionY) {
        this.x = this.getRealXBySection(centerSectionX);
        this.y = this.getRealYBySection(centerSectionY);
        this.centerSectionX = centerSectionX;
        this.centerSectionY = centerSectionY;
    }
    getRealXBySection(sectionX) {
        return ArcadeHandler.getHandler().FIELD_START_X + sectionX * ArcadeHandler.getHandler().FIELD_SECTION_SIZE;
    }
    getRealYBySection(sectionY) {
        return ArcadeHandler.getHandler().FIELD_START_Y + sectionY * ArcadeHandler.getHandler().FIELD_SECTION_SIZE;
    }
    setBlocks(blocks) {
        this.blocks = blocks;
    }
    setColor(color) {
        this.color = color;
    }
}
//# sourceMappingURL=stageButton.js.map