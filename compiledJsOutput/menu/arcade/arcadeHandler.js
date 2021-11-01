import BlockColor from "../../color/blockColor.js";
import Tetris from "../../game/tetris.js";
import Levels from "../../level/levels.js";
import StageBlock from "./stageBlock.js";
import StageButton from "./stageButton.js";
export default class ArcadeHandler {
    constructor() {
        this.FIELD_WIDTH = 6;
        this.FIELD_HEIGHT = 7;
        this.FIELD_SECTION_SIZE = 50;
        this.REAL_FIELD_WIDTH = this.FIELD_WIDTH * this.FIELD_SECTION_SIZE;
        this.REAL_FIELD_HEIGHT = this.FIELD_HEIGHT * this.FIELD_SECTION_SIZE;
        this.FIELD_START_X = 400;
        this.FIELD_START_Y = Tetris.instance.WINDOW_HEIGHT / 2 - this.REAL_FIELD_HEIGHT / 2;
        this.stageButtons = [];
        ArcadeHandler.instance = this;
        this.registerStages();
    }
    update(delta) {
    }
    draw(context) {
        for (const button of this.stageButtons) {
            button.draw(context);
        }
    }
    static getHandler() {
        if (ArcadeHandler.instance == null)
            new ArcadeHandler();
        return ArcadeHandler.instance;
    }
    registerStages() {
        const stage1 = new StageButton();
        stage1.setBlocks([
            new StageBlock(0, 0, Levels.LEVEL_1, stage1),
            new StageBlock(0, 1, Levels.LEVEL_1, stage1),
            new StageBlock(0, 2, Levels.LEVEL_1, stage1),
            new StageBlock(1, 1, Levels.LEVEL_1, stage1),
        ]);
        stage1.setColor(BlockColor.GREEN);
        stage1.setSection(0, 0);
        stage1.setCenterSection(2, 2);
        this.stageButtons.push(stage1);
        const stage2 = new StageButton();
        stage2.setBlocks([
            new StageBlock(0, 0, Levels.LEVEL_1, stage2),
            new StageBlock(0, 1, Levels.LEVEL_1, stage2),
            new StageBlock(1, 1, Levels.LEVEL_1, stage2),
            new StageBlock(1, 2, Levels.LEVEL_1, stage2),
        ]);
        stage2.setColor(BlockColor.BLUE);
        stage2.setSection(4, 0);
        stage2.setCenterSection(3, 1);
        this.stageButtons.push(stage2);
        const stage3 = new StageButton();
        stage3.setBlocks([
            new StageBlock(0, 0, Levels.LEVEL_1, stage3),
            new StageBlock(0, 1, Levels.LEVEL_1, stage3),
            new StageBlock(0, 2, Levels.LEVEL_1, stage3),
            new StageBlock(1, 2, Levels.LEVEL_1, stage3),
        ]);
        stage3.setColor(BlockColor.ORANGE);
        stage3.setSection(0, 4);
        stage3.setCenterSection(1, 3);
        this.stageButtons.push(stage3);
        const stage4 = new StageButton();
        stage4.setBlocks([
            new StageBlock(0, 0, Levels.LEVEL_1, stage4),
            new StageBlock(0, 1, Levels.LEVEL_1, stage4),
            new StageBlock(1, 0, Levels.LEVEL_1, stage4),
            new StageBlock(1, 1, Levels.LEVEL_1, stage4),
        ]);
        stage4.setColor(BlockColor.RED);
        stage4.setSection(4, 5);
        stage4.setCenterSection(3, 4);
        this.stageButtons.push(stage4);
    }
}
//# sourceMappingURL=arcadeHandler.js.map