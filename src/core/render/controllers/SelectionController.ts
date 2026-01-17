import KeyboardController from "./KeyboardController";
import { EventBus } from "../EventBus";
import Event from "../EventNames";
import EventPayload from "../interfaces/EventPayload";
import EntityBase from "../entities/EntityBase";
import EntityProps from "../interfaces/EntityProps";

export default class SelectionController {
    private selected: EntityBase[] = [];
    private eventBus: EventBus;
    private inputState: KeyboardController;

    constructor(eventBus: EventBus, inputState: KeyboardController) {
        this.eventBus = eventBus;
        this.inputState = inputState;

        this.eventBus.listen(Event.entity.CLICK, this.handleEntityClick.bind(this));
    }

    private handleEntityClick(payload: EventPayload) {
        const entity = payload.target as EntityBase;

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

    private removeFromSelection(entity: EntityBase): void {
        this.selected = this.selected.filter(e => e.id !== entity.id);

        this.eventBus.trigger(Event.selection.UNSELECT, new EventPayload(undefined, this.calculateBoundaries(entity.id)));
    }

    private changeSelection(entity: EntityBase): void {
        this.clearSelection();
        this.selected[0] = entity;

        this.eventBus.trigger(Event.selection.SELECT, new EventPayload(undefined, entity));
    }

    private addToSelection(entity: EntityBase): void {
        if (!this.selected.includes(entity)) {
            this.selected.push(entity);
        }

        this.eventBus.trigger(Event.selection.SELECT, new EventPayload(undefined, this.calculateBoundaries(entity.id)));
    }

    private calculateBoundaries(id: string): EntityProps {
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

        return  new EntityProps(id, minX, minY, maxX - minX, maxY - minY);
    }

    public clearSelection(): void {
        this.selected.length = 0;

        this.eventBus.trigger(Event.selection.CLEAR, new EventPayload());
    }
}