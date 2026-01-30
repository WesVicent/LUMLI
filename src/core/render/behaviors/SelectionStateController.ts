import Entity from "../entities/Entity";
import EntityBase from "../entities/types/EntityBase";
import { Event } from "../../event/EventNames";
import EventPayload from "../../event/types/EventPayload";
import StateController from "../../state/StateController";
import Context from "../../app/Context";

export default class SelectionStateController extends StateController {
    constructor(context: Context) {
        super(context);
    }

    protected listenToEvents(): void {
        this.context.__eventBus.listen(Event.entity.CLICK_UP, this.handleEntityClick.bind(this));
        this.context.__eventBus.listen(Event.global.CONTAINER_CLICK, this.handleContainerClick.bind(this));
    }

    private handleEntityClick(payload: EventPayload) {
        const entity = payload.target as Entity;

        if (!entity) return;

        if (this.context.__appState.keyboard.ctrlPressed) {
            if (this.context.__appState.selectedEntities.includes(entity) && this.context.__appState.selectedEntities.length > 1) {
                this.removeFromSelection(payload);
                return;
            }

            this.addToSelection(entity);
        } else {
            if (!this.context.__appState.selectedEntities.includes(entity)) {
                this.changeSelection(entity);
            }
        }
    }

    private handleContainerClick () {
        this.clearSelection();
        this.trigger(Event.selection.UNSELECT, new EventPayload());
    }

    private removeFromSelection(payload: EventPayload): void {
        this.context.__appState.selectedEntities = this.context.__appState.selectedEntities.filter(e => e.id !== (payload?.target as Entity).id);

        this.trigger(Event.selection.UNSELECT, new EventPayload(undefined, this.calculateBoundaries((payload?.target as Entity).id)));
    }

    private changeSelection(entity: Entity): void {
        this.clearSelection();
        this.context.__appState.selectedEntities[0] = entity;

        this.trigger(Event.selection.SELECT, new EventPayload(undefined, entity));
    }

    private addToSelection(entity: Entity): void {
        if (!this.context.__appState.selectedEntities.includes(entity)) {
            this.context.__appState.selectedEntities.push(entity);
        }

        this.trigger(Event.selection.SELECT, new EventPayload(undefined, this.calculateBoundaries(entity.id)));
    }

    private calculateBoundaries(id: string): EntityBase {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        this.context.__appState.selectedEntities.forEach(entity => {
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
        this.context.__appState.selectedEntities.length = 0;

        this.trigger(Event.selection.CLEAR, new EventPayload());
    }
}