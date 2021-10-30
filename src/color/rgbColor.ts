export default class RGBColor {

    private _red: number;
    private _green: number;
    private _blue: number;
    private _alpha: number = 1;

    private _rgbString: string;

    /**
     * Creates a grayscale color with the given brightness (0-255)
     */
    public static grayscale(brightness: number) {
        return new RGBColor(brightness, brightness, brightness);
    }

    public constructor(red: number, green: number, blue: number, alpha?: number) {
        this.setComponents(red, green, blue, alpha)
    }

    public setComponents(red: number, green: number, blue: number, alpha?: number) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        if(alpha != undefined && alpha != null) this.alpha = alpha;
    }

    /**
     * Copies every component from the given color
     * @param color Another color
     */
    public setTo(color: RGBColor) {
        this.setComponents(color.red, color.green, color.blue, color.alpha)
    }

    public clone(): RGBColor {
        return new RGBColor(this.red, this.green, this.blue, this.alpha);
    }

    public get red(): number {
        return this._red;
    }

    public get green(): number {
        return this._green;
    }

    public get blue(): number {
        return this._blue;
    }

    public get alpha(): number {
        return this._alpha;
    }

    public set red(red: number) {
        this._red = this.clampColor(red);
        this.updateRGBString();
    }

    public set green(green: number) {
        this._green = this.clampColor(green);
        this.updateRGBString();
    }

    public set blue(blue: number) {
        this._blue = this.clampColor(blue);
        this.updateRGBString();
    }

    public set alpha(alpha: number) {
        this._alpha = this.clamp(alpha, 0, 1);
        this.updateRGBString();
    }

    /**
     * Gets the string that can be used to draw using the context
     */
    public get rgbString(): string {
        return this._rgbString;
    }

    /**
     * Lightens every component of the color by the given amount
     */
    public lighten(amount: number) {
        this.red += amount;
        this.green += amount;
        this.blue += amount;
    }

    /**
     * Darkens every component of the color by the given amount
     */
    public darken(amount: number) {
        this.red -= amount;
        this.green -= amount;
        this.blue -= amount;
    }

    /**
     * Transforms every color component to the corresponding given color's component
     * @param color The color to fade to
     * @param amount Fading amount (0-1). The higher the value, the closer the total color will be.
     */
    public instantFadeTo(color: RGBColor, amount: number) {
        amount = this.clamp(amount, 0, 1);
        this.red = this.fadeComponent(this.red, color.red, amount);
        this.green = this.fadeComponent(this.green, color.green, amount);
        this.blue = this.fadeComponent(this.blue, color.blue, amount);
        this.alpha = this.fadeComponent(this.alpha, color.alpha, amount);
    }

    private fadeComponent(from: number, to: number, amount: number): number {
        return Math.abs((to - from) * amount) + (from < to ? from : to);
    }

    private updateRGBString(): void {
        if(this.alpha == 1) this._rgbString = `rgb(${this._red}, ${this._green}, ${this._blue})`;
        this._rgbString = `rgba(${this._red}, ${this._green}, ${this._blue}, ${this._alpha})`;
    }

    private clamp(n: number, min: number, max: number) {
        return n < min ? min : (n > max ? max : n);
    }

    private clampColor(color: number): number {
        return this.clamp(color, 0, 255);
    }

}