/**
 * Handles user inputs
 */
export default class InputHandler {

    private static instance: InputHandler;

    private readonly bindings = {
        FIGURE_MOVE_RIGHT: new KeyMapping("ArrowRight", "KeyD"),
        FIGURE_MOVE_LEFT: new KeyMapping("ArrowLeft", "KeyA"),
        FIGURE_MOVE_DOWN: new KeyMapping("ArrowDown", "KeyS"),
    }

    private constructor() {
    }

    public static getHandler(): InputHandler {
        if(this.instance == null) return new InputHandler();
        return this.instance;
    }

    public registerListeners() {
        document.addEventListener('keydown', this.onKeyPress);
    }

    private onKeyPress(event: KeyboardEvent) {
        if(!event.repeat) {
            
        }
    }

    private onBindingActivate(binding: KeyMapping) {

    }

}

export class KeyMapping {
    
    private keyboardCodes: string[];

    constructor(...keyboardCodes: string[]) {
        this.keyboardCodes = keyboardCodes;
    }

    /**
     * Checks whether the given code is mapped to the current key binding
     * @param code The keyboard code to check
     */
    public isMapped(code: string): boolean {
        return this.keyboardCodes.includes(code);
    }

}

export enum KeyBinding {
    FIGURE_MOVE_RIGHT,
    FIGURE_MOVE_LEFT,
    FIGURE_MOVE_DOWN
}