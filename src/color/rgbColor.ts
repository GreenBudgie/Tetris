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
        this.red = red;
        this.green = green;
        this.blue = blue;
        if(alpha != undefined && alpha != null) this.alpha = alpha;
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
        this._alpha = this.clampAlpha(alpha);
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

    private updateRGBString(): void {
        if(this.alpha == 1) this._rgbString = `rgb(${this._red}, ${this._green}, ${this._blue})`;
        this._rgbString = `rgba(${this._red}, ${this._green}, ${this._blue}, ${this._alpha})`;
    }

    private clampColor(color: number): number {
        return color < 0 ? 0 : (color > 255 ? 255 : color);
    }

    private clampAlpha(alpha: number): number {
        return alpha < 0 ? 0 : (alpha > 1 ? 1 : alpha);
    }

}