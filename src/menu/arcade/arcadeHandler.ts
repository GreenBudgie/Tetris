import BlockColor from "../../color/blockColor.js";
import InputHandler, {KeyBindings} from "../../game/inputHandler.js";
import Tetris from "../../game/tetris.js";
import Levels from "../../level/levels.js";
import Processable from "../../util/processable.js";
import StageBlock from "./stageBlock.js";
import StageButton from "./stageButton.js";

export default class ArcadeHandler implements Processable {

    public readonly FIELD_WIDTH = 6;
    public readonly FIELD_HEIGHT = 7;
    public readonly FIELD_SECTION_SIZE = 50;
    public readonly REAL_FIELD_WIDTH = this.FIELD_WIDTH * this.FIELD_SECTION_SIZE;
    public readonly REAL_FIELD_HEIGHT = this.FIELD_HEIGHT * this.FIELD_SECTION_SIZE;
    public readonly FIELD_START_X = 400;
    public readonly FIELD_START_Y = Tetris.instance.WINDOW_HEIGHT / 2 - this.REAL_FIELD_HEIGHT / 2;

    private static instance: ArcadeHandler;
    public stageButtons: StageButton[] = [];
    private _hoveredButtonIndex: number = 0;

    public state: "hide" | "show" | "stageSelect" | "levelSelect" = "hide"; 

    private constructor() {
        ArcadeHandler.instance = this;
        this.registerStages();
    }

    public static getHandler(): ArcadeHandler {
        if(ArcadeHandler.instance == null) new ArcadeHandler();
        return ArcadeHandler.instance;
    }

    public get hoveredButtonIndex(): number {
        return this._hoveredButtonIndex;
    }

    public set hoveredButtonIndex(newIndex: number) {
        if(newIndex < 0 || newIndex >= this.stageButtons.length) return;

        if(this._hoveredButtonIndex != newIndex) {
            this.stageButtons[this._hoveredButtonIndex].onUnhover();
            this.stageButtons[newIndex].onHover();
        }

        this._hoveredButtonIndex = newIndex;
    }

    public playAppearEffect(): void {
        this.stageButtons.forEach(button => button.playAppearEffect());
    }

    public playDisappearEffect(): void {
        this.stageButtons.forEach(button => button.playDisappearEffect());
    }

    public update(delta: number): void {
        if(this.state == "stageSelect") {
            if(InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_DOWN)) {
                this.hoveredButtonIndex += 2;
            }
            if(InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_UP)) {
                this.hoveredButtonIndex -= 2;
            }
            if(InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_RIGHT)) {
                this.hoveredButtonIndex += 1;
            }
            if(InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_LEFT)) {
                if(this.hoveredButtonIndex % 2 == 0) {
                    this.stopStageSelect();
                } else {
                    this.hoveredButtonIndex -= 1;
                }
            }
            if(InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_SELECT)) {
                this.startLevelSelect();
            }
            if(InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_BACK)) {
                this.stopStageSelect();
            }
        }
        if(this.state == "levelSelect") {
            if(InputHandler.getHandler().isKeyBindingPressed(KeyBindings.MENU_BACK)) {
                this.stopLevelSelect();
            }
        }
        this.stageButtons.forEach(button => button.update(delta));
    }

    public draw(context: CanvasRenderingContext2D): void {
        if(this.state == "hide") return;
        this.stageButtons.forEach(button => button.draw(context));
    }

    public stopStageSelect(): void {
        this.getHoveredButton().onUnhover();
        this.state = "show";
    }

    public startStageSelect(): void {
        this.state = "stageSelect";
        this.hoveredButtonIndex = 0;
        this.getHoveredButton().onHover();
    }

    public startLevelSelect(): void {
        this.state = "levelSelect";
        for(const button of this.stageButtons) {
            if(button.isHoveredOrSelected()) {
                button.onSelect();
            } else {
                button.hideWhenAnotherSelected();
            }
        }
    }

    public stopLevelSelect(): void {
        this.state = "stageSelect";
        for(const button of this.stageButtons) {
            if(button.isHoveredOrSelected()) {
                button.onDeselect();
            } else {
                button.showWhenAnotherDeselected();
            }
        }
    }

    public getHoveredButton(): StageButton {
        return this.stageButtons[this.hoveredButtonIndex];
    }

    private registerStages(): void {
        const stage1 = new StageButton(0);
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

        const stage2 = new StageButton(1);
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

        const stage3 = new StageButton(2);
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

        const stage4 = new StageButton(3);
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