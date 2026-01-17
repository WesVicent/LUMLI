import KeyboardStateManager from "../../input/KeyboardStateManager";
import Entity from "../entities/Entity";
import EntityBase from "../entities/types/EntityBase";
import { EventBus } from "../../event/EventBus";
import Event from "../../event/EventNames";
import EventPayload from "../../event/types/EventPayload";

export default class SelectionController {
    private selected: Entity[] = [];
    private eventBus: EventBus;
    private inputState: KeyboardStateManager;

    constructor(eventBus: EventBus, inputState: KeyboardStateManager) {
        this.eventBus = eventBus;
        this.inputState = inputState;

        this.eventBus.listen(Event.entity.CLICK, this.handleEntityClick.bind(this));
    }

    private handleEntityClick(payload: EventPayload) {
        const entity = payload.target as Entity;

        if (!entity) return;

        if (this.inputState.isCtrlPressed()) {
            if (this.selected.includes(entity)) {
                this.removeFromSelection(entity);
                return;
            }

            this.addToSelection(entity);
        } else {
            this.changeSelection(entity);
        }
    }

    private removeFromSelection(entity: Entity): void {
        this.selected = this.selected.filter(e => e.id !== entity.id);

        this.eventBus.trigger(Event.selection.UNSELECT, new EventPayload(undefined, this.calculateBoundaries(entity.id)));
    }

    private changeSelection(entity: Entity): void {
        this.clearSelection();
        this.selected[0] = entity;

        this.eventBus.trigger(Event.selection.SELECT, new EventPayload(undefined, entity));
    }

    private addToSelection(entity: Entity): void {
        if (!this.selected.includes(entity)) {
            this.selected.push(entity);
        }

        this.eventBus.trigger(Event.selection.SELECT, new EventPayload(undefined, this.calculateBoundaries(entity.id)));
    }

    private calculateBoundaries(id: string): EntityBase {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        this.selected.forEach(entity => {
            const entityRight = entity.x + entity.width;
            const entityBottom = entity.y + entity.height;

            minX = Math.min(minX, entity.x);
            minY = Math.min(minY, entity.y);
            maxX = Math.max(maxX, entityRight);
            maxY = Math.max(maxY, entityBottom);
        });

        return  new EntityBase(id, minX, minY, maxX - minX, maxY - minY);
    }

    public clearSelection(): void {
        this.selected.length = 0;

        this.eventBus.trigger(Event.selection.CLEAR, new EventPayload());
    }
}