import Entity from "../entities/Entity";
import EntityBase from "../entities/types/EntityBase";
import { EventBus } from "../../event/EventBus";
import Event from "../../event/EventNames";
import EventPayload from "../../event/types/EventPayload";
import StateController from "../../state/StateController";
import AppState from "../../state/AppState";

export default class SelectionStateController extends StateController {
    constructor(eventBus: EventBus, appState: AppState) {
        super(eventBus, appState);
    }

    protected listenToEvents(): void {
        this.eventBus.listen(Event.entity.CLICK_UP, this.handleEntityClick.bind(this));
    }

    private handleEntityClick(payload: EventPayload) {
        const entity = payload.target as Entity;

        if (!entity) return;

        if (this.appState.keyboard.ctrlPressed) {
            if (this.appState.selectedEntities.includes(entity)) {
                this.removeFromSelection(entity);
                return;
            }

            this.addToSelection(entity);
        } else {
            if (!this.appState.selectedEntities.includes(entity)) {
                this.changeSelection(entity);
            }
        }
    }

    private removeFromSelection(entity: Entity): void {
        this.appState.selectedEntities = this.appState.selectedEntities.filter(e => e.id !== entity.id);

        this.trigger(Event.selection.UNSELECT, new EventPayload(undefined, this.calculateBoundaries(entity.id)));
    }

    private changeSelection(entity: Entity): void {
        this.clearSelection();
        this.appState.selectedEntities[0] = entity;

        this.trigger(Event.selection.SELECT, new EventPayload(undefined, entity));
    }

    private addToSelection(entity: Entity): void {
        if (!this.appState.selectedEntities.includes(entity)) {
            this.appState.selectedEntities.push(entity);
        }

        this.trigger(Event.selection.SELECT, new EventPayload(undefined, this.calculateBoundaries(entity.id)));
    }

    private calculateBoundaries(id: string): EntityBase {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        this.appState.selectedEntities.forEach(entity => {
            const entityRight = entity.x + entity.width;
            const entityBottom = entity.y + entity.height;

            minX = Math.min(minX, entity.x);
            minY = Math.min(minY, entity.y);
            maxX = Math.max(maxX, entityRight);
            maxY = Math.max(maxY, entityBottom);
        });

        return new EntityBase(id, minX, minY, maxX - minX, maxY - minY);
    }

    public clearSelection(): void {
        this.appState.selectedEntities.length = 0;

        this.trigger(Event.selection.CLEAR, new EventPayload());
    }
}