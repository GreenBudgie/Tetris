import Field from "./field.js";
import Level from "./level.js";

export default class Levels {

    public static readonly LEVEL_1: Level = new Level(1);

    public static registerLevels() {
        Levels.LEVEL_1.field = Field.defaultSizeField();
        Levels.LEVEL_1.requiredPoints = 12 * 8;
    }

}