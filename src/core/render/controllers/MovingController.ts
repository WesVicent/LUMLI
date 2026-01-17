import { EventBus } from "../../event/EventBus";
import Event from "../../event/EventNames";
import Entity from "../entities/Entity";
import EventPayload from "../interfaces/EventPayload";
import Controller from "./Controller";

export default class MovingController extends Controller {

    constructor(eventBus: EventBus) {
        super(eventBus);
        console.info('Moving Controller setted up')
    }

    protected listenToEvents(): void {
        this.listen(Event.entity.START_MOVEMENT, this.onMoveStart);
        this.listen(Event.entity.MOVING, this.onMoving);
        this.listen(Event.entity.STOP_MOVEMENT, this.onMoveEnd);
    }

    private onMoveStart(payload: EventPayload): void {
        const event = payload.event!;

        event.sourceEvent.stopPropagation();
    }

    private onMoving(payload: EventPayload): void {
        const event = payload.event!;
        const target = payload.target! as Entity;

        target.x += event.dx;
        target.y += event.dy;

        target.translate(target.x, target.y);
    }

    private onMoveEnd(payload: EventPayload): void {
        const event = payload.event!;
        const target = payload.target! as Entity;

        target.x += event.dx;
        target.y += event.dy;

        target.translate(target.x, target.y);
    }


}