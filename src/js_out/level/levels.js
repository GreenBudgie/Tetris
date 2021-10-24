import Field from "../game/Field.js";
import Level from "./Level.js";
export default class Levels {
    static registerLevels() {
        Levels.LEVEL_1.field = Field.defaultSizeField();
        Levels.LEVEL_1.requiredPoints = 12 * 8;
    }
}
Levels.LEVEL_1 = new Level();
//# sourceMappingURL=Levels.js.map