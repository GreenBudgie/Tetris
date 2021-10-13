/**
 * A block is either a part of a figure attached to other parts, or a fallen block that fills up the field.
 * The block has coordinates relative to a figure.
 *
 */
export default class Block {
    Block(x, y, color) {
        this.x = x;
        this.y = y;
        if (color == null) {
            this.selectRandomColor();
        }
        else {
            this.color = color;
        }
    }
    selectRandomColor() {
        let colors;
        for (let blockColor in BlockColor) {
            colors.push(BlockColor[blockColor]);
        }
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }
}
export var BlockColor;
(function (BlockColor) {
    BlockColor["RED"] = "black";
    BlockColor["GREEN"] = "green";
    BlockColor["BLUE"] = "blue";
    BlockColor["PINK"] = "pink";
    BlockColor["YELLOW"] = "yellow";
    BlockColor["ORANGE"] = "orange";
})(BlockColor || (BlockColor = {}));
//# sourceMappingURL=block.js.map