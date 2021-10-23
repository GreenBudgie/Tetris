export default interface Processable {

    update(delta: number): void;
    draw(context: CanvasRenderingContext2D): void;

}