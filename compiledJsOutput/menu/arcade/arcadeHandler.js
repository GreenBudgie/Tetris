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
        this.needsToDraw = false;
        ArcadeHandler.instance = this;
        this.registerStages();
    }
    playAppearEffect() {
        this.stageButtons.forEach(button => button.playAppearEffect());
    }
    playDisappearEffect() {
        this.stageButtons.forEach(button => button.playDisappearEffect());
    }
    update(delta) {
    }
    draw(context) {
        if (!this.needsToDraw)
            return;
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
        stage1.setStartSection(2, 2);
        stage1.setEndSection(0, 0);
        this.stageButtons.push(stage1);
        const stage2 = new StageButton();
        stage2.setBlocks([
            new StageBlock(0, 0, Levels.LEVEL_1, stage2),
            new StageBlock(0, 1, Levels.LEVEL_1, stage2),
            new StageBlock(1, 1, Levels.LEVEL_1, stage2),
            new StageBlock(1, 2, Levels.LEVEL_1, stage2),
        ]);
        stage2.setColor(BlockColor.BLUE);
        stage2.setStartSection(3, 1);
        stage2.setEndSection(4, 0);
        this.stageButtons.push(stage2);
        const stage3 = new StageButton();
        stage3.setBlocks([
            new StageBlock(0, 0, Levels.LEVEL_1, stage3),
            new StageBlock(0, 1, Levels.LEVEL_1, stage3),
            new StageBlock(0, 2, Levels.LEVEL_1, stage3),
            new StageBlock(1, 2, Levels.LEVEL_1, stage3),
        ]);
        stage3.setColor(BlockColor.ORANGE);
        stage3.setStartSection(1, 3);
        stage3.setEndSection(0, 4);
        this.stageButtons.push(stage3);
        const stage4 = new StageButton();
        stage4.setBlocks([
            new StageBlock(0, 0, Levels.LEVEL_1, stage4),
            new StageBlock(0, 1, Levels.LEVEL_1, stage4),
            new StageBlock(1, 0, Levels.LEVEL_1, stage4),
            new StageBlock(1, 1, Levels.LEVEL_1, stage4),
        ]);
        stage4.setColor(BlockColor.RED);
        stage4.setStartSection(3, 4);
        stage4.setEndSection(4, 5);
        this.stageButtons.push(stage4);
    }
}
//# sourceMappingURL=arcadeHandler.js.map