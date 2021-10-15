/**
 * Handles user inputs
 */
export default class InputHandler {
    constructor() {
        this.bindings = {
            KeyBinding, : .FIGURE_MOVE_RIGHT, new: KeyMapping("ArrowRight", "KeyD"),
            FIGURE_MOVE_LEFT: new KeyMapping("ArrowLeft", "KeyA"),
            FIGURE_MOVE_DOWN: new KeyMapping("ArrowDown", "KeyS"),
        };
    }
    static getHandler() {
        if (this.instance == null)
            return new InputHandler();
        return this.instance;
    }
    registerListeners() {
        document.addEventListener('keydown', this.onKeyPress);
    }
    onKeyPress(event) {
        if (!event.repeat) {
        }
    }
}
export class KeyMapping {
    constructor(...keyboardCodes) {
        this.keyboardCodes = keyboardCodes;
    }
    /**
     * Checks whether the given code is mapped to the current key binding
     * @param code The keyboard code to check
     */
    isMapped(code) {
        return this.keyboardCodes.includes(code);
    }
}
export var KeyBinding;
(function (KeyBinding) {
    KeyBinding[KeyBinding["FIGURE_MOVE_RIGHT"] = 0] = "FIGURE_MOVE_RIGHT";
    KeyBinding[KeyBinding["FIGURE_MOVE_LEFT"] = 1] = "FIGURE_MOVE_LEFT";
    KeyBinding[KeyBinding["FIGURE_MOVE_DOWN"] = 2] = "FIGURE_MOVE_DOWN";
})(KeyBinding || (KeyBinding = {}));
//# sourceMappingURL=input_handler.js.map