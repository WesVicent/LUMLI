import Entity from "../../render/entities/Entity";
import EntityBase from "../../render/entities/types/EntityBase";

type LumMultiEventTarget = Entity | EntityBase;

export default class EventPayload {
    public event?: LumMultiDragEvent;
    public target?: LumMultiEventTarget;

    constructor(event?: LumMultiDragEvent, target?: LumMultiEventTarget) {
        this.event = event;
        this.target = target;
    }
}