import Level from "./level.js";
export default class Levels {
    static registerLevels() {
        Levels.LEVEL_1.requiredPoints = 12 * 8;
    }
}
Levels.LEVEL_1 = new Level(1);
//# sourceMappingURL=levels.js.map