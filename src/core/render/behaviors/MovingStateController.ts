import AppState from "../../state/AppState";
import { EventBus } from "../../event/EventBus";
import Event from "../../event/EventNames";
import EventPayload from "../../event/types/EventPayload";
import StateController from "../../state/StateController";
import Entity from "../entities/Entity";

export default class MovingStateController extends StateController {

    constructor(eventBus: EventBus, appState: AppState) {
        super(eventBus, appState);
    }

    protected listenToEvents(): void {
        this.listen(Event.entity.START_MOVEMENT, this.onMoveStart.bind(this));
        this.listen(Event.entity.MOVING, this.updateEntityPositions.bind(this));
        this.listen(Event.entity.STOP_MOVEMENT, this.updateEntityPositions.bind(this));
    }

    private onMoveStart(payload: EventPayload): void {
        const event = payload.event!;

        event.sourceEvent.stopPropagation();
    }

    private updateEntityPositions(payload: EventPayload) {
        const event = payload.event!;

        // If no entity was clicked yet, or clicked entity isn't selected.
        if (!this.appState.selectedEntities.includes(payload.target as Entity) || this.appState.selectedEntities.length === 0) {
            this.eventBus.trigger(Event.selection.CLEAR);
            this.eventBus.trigger(Event.selection.SELECT, payload);
            
            let entity = payload.target! as Entity;
            entity.x += event.dx;
            entity.y += event.dy;

            entity.translate(entity.x, entity.y);

            return;
        }

        if (this.appState.selectedEntities.includes(payload.target as Entity)) {
            this.appState.selectedEntities.forEach(entity => {
                entity.x += event.dx;
                entity.y += event.dy;

                entity.translate(entity.x, entity.y);
            });

            return;
        }
    }
}