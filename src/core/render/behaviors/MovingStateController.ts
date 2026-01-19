import AppState from "../../state/AppState";
import { EventBus } from "../../event/EventBus";
import Event from "../../event/EventNames";
import EventPayload from "../../event/types/EventPayload";
import StateController from "../../state/StateController";

export default class MovingStateController extends StateController {

    constructor(eventBus: EventBus, appState: AppState) {
        super(eventBus, appState);
    }

    protected listenToEvents(): void {
        this.listen(Event.entity.START_MOVEMENT, this.onMoveStart.bind(this));
        this.listen(Event.entity.MOVING, this.onMoving.bind(this));
        this.listen(Event.entity.STOP_MOVEMENT, this.onMoveEnd.bind(this));
    }

    private onMoveStart(payload: EventPayload): void {
        const event = payload.event!;

        event.sourceEvent.stopPropagation();
    }

    private onMoving(payload: EventPayload): void {
        const event = payload.event!;
        
        this.appState.selectedEntities.forEach(entity => {
            entity.x += event.dx;
            entity.y += event.dy;
    
            entity.translate(entity.x, entity.y);
        });
    }

    private onMoveEnd(payload: EventPayload): void {
        const event = payload.event!;

        this.appState.selectedEntities.forEach(entity => {
            entity.x += event.dx;
            entity.y += event.dy;
    
            entity.translate(entity.x, entity.y);
        });
    }


}