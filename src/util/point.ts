/**
 * Utility class that represents a pair of coordinates.
 * The point is mutable, use clone() to create a new point.
 */
export default class Point {

    private _x: number;
    private _y: number;
    private immutable: boolean = false;

    public constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    /**
     * Creates a new point with coordinates set to zero
     */
    public static zero(): Point {
        return new Point(0, 0);
    }

    /**
     * Makes this point immutable so you cannot change its coordinates
     */
    public makeImmutable(): Point {
        this.immutable = true;
        return this;
    }

    /**
     * Creates a copy of the current point
     */
    public clone(): Point {
        return new Point(this.x, this.y);
    }

    public equals(point: Point): boolean {
        return this.x == point.x && this.y == point.y;
    }

    get x(): number {
        return this._x;
    }

    set x(x: number) {
        this._x = x;
    }

    get y(): number {
        return this._y;
    }

    set y(y: number) {
        this._y = y;
    }

    private throwIfImmutable() {
        if(this.immutable) throw "Cannot change coordinates of an immutable point";
    }

    public setPosition(x: number, y: number): Point {
        this.throwIfImmutable();
        this.x = x;
        this.y = y;
        return this;
    }

    public setPositionTo(point: Point): Point {
        this.throwIfImmutable();
        this.x = point.x;
        this.y = point.y;
        return this;
    }

    public moveBy(x: number, y: number): Point {
        this.throwIfImmutable();
        this.x += x;
        this.y += y;
        return this;
    }

    /**
     * Change coordinates by (point.x; point.y)
     * @param point end point
     */
    public add(point: Point): Point {
        return this.moveBy(point.x, point.y);
    }

    public subtract(point: Point): Point {
        return this.moveBy(-point.x, -point.y);
    }

    /**
     * Gets the SQUARED distance between this point and another one
     */
    public distanceSq(point: Point): number {
        const xDiff = this.x - point.x;
        const yDiff = this.y - point.y;
        return xDiff * xDiff + yDiff * yDiff;
    }

    /**
     * Gets the distance between this point and another one
     */
    public distance(point: Point): number {
        return Math.sqrt(this.distanceSq(point));
    }

    /**
     * Rotates the point by the specified angle around the origin
     * @param angleInRadians Angle in radians
     * @param origin A point to rotate the current point around
     */
    public rotate(angleInRadians: number, origin: Point): Point {
        this.throwIfImmutable();
        const angleSin = Math.sin(angleInRadians);
        const angleCos = Math.cos(angleInRadians);
        this.x -= origin.x;
        this.y -= origin.y;
        const rotatedX = this.x * angleCos - this.y * angleSin;
        const rotatedY = this.x * angleSin + this.y * angleCos;
        this.x = rotatedX + origin.x;
        this.y = rotatedY + origin.y;
        return this;
    }

    public toString() {
        return `Point(${this._x}, ${this._y})` + (this.immutable ? "(immutable)" : "");
    }

}

export class PointArray {

    private points: Point[] = [];

    public static begin(x: number, y: number): PointArray {
        return new PointArray().add(x, y);
    }

    public add(x: number, y: number): PointArray {
        this.points.push(new Point(x, y));
        return this;
    }

    public build(): Point[] {
        return this.points;
    }
    
}

export interface Positionable {

    get position(): Point;

}
