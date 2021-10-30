export default class RGBColor {
    constructor(red, green, blue, alpha) {
        this._alpha = 1;
        this.setComponents(red, green, blue, alpha);
    }
    /**
     * Creates a grayscale color with the given brightness (0-255)
     */
    static grayscale(brightness) {
        return new RGBColor(brightness, brightness, brightness);
    }
    setComponents(red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        if (alpha != undefined && alpha != null)
            this.alpha = alpha;
    }
    /**
     * Copies every component from the given color
     * @param color Another color
     */
    setTo(color) {
        this.setComponents(color.red, color.green, color.blue, color.alpha);
    }
    clone() {
        return new RGBColor(this.red, this.green, this.blue, this.alpha);
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
        this._alpha = this.clamp(alpha, 0, 1);
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
    /**
     * Transforms every color component to the corresponding given color's component
     * @param color The color to fade to
     * @param amount Fading amount (0-1). The higher the value, the closer the total color will be.
     */
    instantFadeTo(color, amount) {
        amount = this.clamp(amount, 0, 1);
        this.red = this.fadeComponent(this.red, color.red, amount);
        this.green = this.fadeComponent(this.green, color.green, amount);
        this.blue = this.fadeComponent(this.blue, color.blue, amount);
        this.alpha = this.fadeComponent(this.alpha, color.alpha, amount);
    }
    fadeComponent(from, to, amount) {
        return Math.sign(to - from) * Math.abs((to - from) * amount) + from;
    }
    updateRGBString() {
        if (this.alpha == 1) {
            this._rgbString = `rgb(${this._red}, ${this._green}, ${this._blue})`;
            return;
        }
        this._rgbString = `rgba(${this._red}, ${this._green}, ${this._blue}, ${this._alpha})`;
    }
    clamp(n, min, max) {
        return n < min ? min : (n > max ? max : n);
    }
    clampColor(color) {
        return this.clamp(color, 0, 255);
    }
}
//# sourceMappingURL=rgbColor.js.map