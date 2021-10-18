import Field from "../game/field.js";

export default class Level {

    public field: Field;
    public filled_rows: number = 0;
    public points: number = 0;
    public required_points: number;

    public update(delta: number) {
        this.field.update(delta);
    }

    public draw() {
        this.field.draw();
    }

}