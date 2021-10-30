export default class RGBColor {
    constructor(red, green, blue, alpha) {
        this._alpha = 1;
        this.red = red;
        this.green = green;
        this.blue = blue;
        if (alpha != undefined && alpha != null)
            this.alpha = alpha;
    }
    /**
     * Creates a grayscale color with the given brightness (0-255)
     */
    static grayscale(brightness) {
        return new RGBColor(brightness, brightness, brightness);
    }
    get red() {
        return this._red;
    }
    get green() {
        return this._green;
    }
    get blue() {
        return this._blue;
    }
    get alpha() {
        return this._alpha;
    }
    set red(red) {
        this._red = this.clampColor(red);
        this.updateRGBString();
    }
    set green(green) {
        this._green = this.clampColor(green);
        this.updateRGBString();
    }
    set blue(blue) {
        this._blue = this.clampColor(blue);
        this.updateRGBString();
    }
    set alpha(alpha) {
        this._alpha = this.clampAlpha(alpha);
        this.updateRGBString();
    }
    /**
     * Gets the string that can be used to draw using the context
     */
    get rgbString() {
        return this._rgbString;
    }
    /**
     * Lightens every component of the color by the given amount
     */
    lighten(amount) {
        this.red += amount;
        this.green += amount;
        this.blue += amount;
    }
    /**
     * Darkens every component of the color by the given amount
     */
    darken(amount) {
        this.red -= amount;
        this.green -= amount;
        this.blue -= amount;
    }
    updateRGBString() {
        if (this.alpha == 1)
            this._rgbString = `rgb(${this._red}, ${this._green}, ${this._blue})`;
        this._rgbString = `rgba(${this._red}, ${this._green}, ${this._blue}, ${this._alpha})`;
    }
    clampColor(color) {
        return color < 0 ? 0 : (color > 255 ? 255 : color);
    }
    clampAlpha(alpha) {
        return alpha < 0 ? 0 : (alpha > 1 ? 1 : alpha);
    }
}
//# sourceMappingURL=rgbColor.js.map