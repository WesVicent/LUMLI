import {Event} from "../../event/EventNames";
import EventPayload from "../../event/types/EventPayload";
import StateController from "../../state/StateController";
import Entity from "../entities/Entity";
import Context from "../../app/Context";
import BoundaryBox from "../entities/GUI/BoundaryBox";

export default class MovingStateController extends StateController {
    private hasTriggered = false;

    constructor(context: Context) {
        super(context);
    }

    protected listenToEvents(): void {
        this.listen(Event.entity.START_MOVEMENT, this.onMoveStart.bind(this));
        this.listen(Event.entity.MOVING, this.updateEntityPositions.bind(this));
        this.listen(Event.entity.STOP_MOVEMENT, this.stopMovement.bind(this));
    }

    private onMoveStart(payload: EventPayload): void {
        const event = payload.event!;

        event.sourceEvent.stopPropagation();
    }

    private updateEntityPositions(payload: EventPayload) {
        const event = payload.event!;        

        if (this.context.__appState.selectedEntities.includes(payload.target as Entity) || payload.target instanceof BoundaryBox) {
            this.context.__appState.selectedEntities.forEach(entity => {
                entity.x += event.dx;
                entity.y += event.dy;

                entity.translate(entity.x, entity.y);
            });
        } else { // If no entity was clicked yet, or clicked entity isn't selected.
            if (!this.hasTriggered) {
                this.context.__eventBus.trigger(Event.selection.SELECT, payload);
                
                this.hasTriggered = true;
            }

            let entity = payload.target! as Entity;
            entity.x += event.dx;
            entity.y += event.dy;

            entity.translate(entity.x, entity.y);
        }
    }

    private stopMovement() {
        this.hasTriggered = false;
    }
}