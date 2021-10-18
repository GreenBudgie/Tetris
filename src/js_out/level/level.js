export default class Level {
    constructor() {
        this.filled_rows = 0;
        this.points = 0;
    }
    update(delta) {
        this.field.update(delta);
    }
    draw() {
        this.field.draw();
    }
}
//# sourceMappingURL=level.js.map