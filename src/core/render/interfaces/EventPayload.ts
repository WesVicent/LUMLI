import EntityBase from "../entities/EntityBase";
import EntityProps from "./EntityProps";

type LumMultiEventTarget = EntityBase | EntityProps;

export default class EventPayload {
    public event?: LumMultiDragEvent;
    public target?: LumMultiEventTarget;

    constructor(event?: D3DragGroupEvent, target?: LumMultiEventTarget) {
        this.event = event;
        this.target = target;
    }
}