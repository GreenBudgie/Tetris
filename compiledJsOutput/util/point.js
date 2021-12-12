/**
 * Utility class that represents a pair of coordinates.
 * The point is mutable, use clone() to create a new point.
 */
export default class Point {
    constructor(x, y) {
        this.immutable = false;
        this._x = x;
        this._y = y;
    }
    /**
     * Creates a new point with coordinates set to zero
     */
    static zero() {
        return new Point(0, 0);
    }
    /**
     * Makes this point immutable so you cannot change its coordinates
     */
    makeImmutable() {
        this.immutable = true;
        return this;
    }
    /**
     * Creates a copy of the current point
     */
    clone() {
        return new Point(this.x, this.y);
    }
    equals(point) {
        return this.x == point.x && this.y == point.y;
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
    throwIfImmutable() {
        if (this.immutable)
            throw "Cannot change coordinates of an immutable point";
    }
    setPosition(x, y) {
        this.throwIfImmutable();
        this.x = x;
        this.y = y;
        return this;
    }
    setPositionTo(point) {
        this.throwIfImmutable();
        this.x = point.x;
        this.y = point.y;
        return this;
    }
    moveBy(x, y) {
        this.throwIfImmutable();
        this.x += x;
        this.y += y;
        return this;
    }
    add(point) {
        return this.moveBy(point.x, point.y);
    }
    subtract(point) {
        return this.moveBy(-point.x, -point.y);
    }
    /**
     * Gets the SQUARED distance between this point and another one
     */
    distanceSq(point) {
        const xDiff = this.x - point.x;
        const yDiff = this.y - point.y;
        return xDiff * xDiff + yDiff * yDiff;
    }
    /**
     * Gets the distance between this point and another one
     */
    distance(point) {
        return Math.sqrt(this.distanceSq(point));
    }
    /**
     * Rotates the point by the specified angle around the origin
     * @param angleInRadians Angle in radians
     * @param origin A point to rotate the current point around
     */
    rotate(angleInRadians, origin) {
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
    toString() {
        return `Point(${this._x}, ${this._y})` + (this.immutable ? "(immutable)" : "");
    }
}
export class PointArray {
    constructor() {
        this.points = [];
    }
    static begin(x, y) {
        return new PointArray().add(x, y);
    }
    add(x, y) {
        this.points.push(new Point(x, y));
        return this;
    }
    build() {
        return this.points;
    }
}
//# sourceMappingURL=point.js.map