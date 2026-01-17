import Movable from "./Movable";
import Resizable from "./Resizable";

export default class EntityProps implements Movable, Resizable {
    public id: string;
    public x: number;
    public y: number;
    public width: number;
    public height: number

    constructor(id?: string, x?: number, y?: number, width?: number, height?: number) {
        this.id = id || '';
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 0;
        this.height = height || 0;
    }
}