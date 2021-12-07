export interface Drawable {
    
    draw(context: CanvasRenderingContext2D): void;

}

export interface Updatable {

    update(delta: number): void;

}

export default interface Processable extends Updatable, Drawable {}