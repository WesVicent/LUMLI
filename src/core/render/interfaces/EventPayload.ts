import EntityBase from "../entities/EntityBase";
import Movable from "./Movable";

type LumMultiDragEvent = D3DragGroupEvent | D3DragRectEvent;
type LumMultiEventTarget = EntityBase;

export default class EventPayload {
    public event: LumMultiDragEvent;
    public target: LumMultiEventTarget;

    constructor(event: D3DragGroupEvent, target: LumMultiEventTarget) {
        this.event = event;
        this.target = target;
    }
}