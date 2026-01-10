export default interface Movable {
    x: number;
    y: number;
    translate(x: number, y: number): void;
}