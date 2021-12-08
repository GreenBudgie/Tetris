import RGBColor from "../color/rgbColor.js";
import Tetris from "../main/tetris.js";
import SpriteFigure from "../sprite/spriteFigure.js";
import Point from "../util/point.js";
import Menu from "./menu.js";
export default class MenuButton {
    constructor(index) {
        this.grayColor = RGBColor.grayscale(200);
        this.index = index;
        this.sprite = new SpriteFigure(this.getShape());
        this.sprite.blockSize = 85;
        this.sprite.setOutlineWidthBasedOnBlockSize();
        this.sprite.outlineMode = "border";
        const startY = Tetris.instance.WINDOW_HEIGHT / 2 - this.sprite.getRealHeight() / 2;
        this.sprite.position.x = this.sprite.blockSize;
        this.sprite.position.y = startY + (index - 1) * this.sprite.blockSize * 1.5;
        this.sprite.getColor().setTo(index == 0 ? this.getColor() : this.grayColor);
        this.textCenterPosition = new Point(this.sprite.position.x + this.getTextCenterPosition().x * this.sprite.blockSize, this.sprite.position.y + this.getTextCenterPosition().y * this.sprite.blockSize);
    }
    isCurrent() {
        return Menu.getMenu().currentButton == this;
    }
    onSelect() {
    }
    onDeselect() {
    }
    click() {
        this.onClick();
    }
    update(delta) {
    }
    draw(context) {
        this.drawFigure(context);
        this.drawText(context);
    }
    drawText(context) {
        context.fillStyle = "white";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = this.getTextSize() + "px ft_default";
        context.fillText(this.getText(), this.textCenterPosition.x, this.textCenterPosition.y);
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.strokeText(this.getText(), this.textCenterPosition.x, this.textCenterPosition.y);
    }
    drawFigure(context) {
        this.sprite.draw(context);
    }
}
//# sourceMappingURL=menuButton.js.map