import AppState from "../../state/AppState";
import { EventBus } from "../../event/EventBus";
import Event from "../../event/EventNames";
import EventPayload from "../../event/types/EventPayload";
import Entity from "../entities/Entity";
import StateController from "../../state/StateController";

export default class MovingStateController extends StateController {

    constructor(eventBus: EventBus, appState: AppState) {
        super(eventBus, appState);
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