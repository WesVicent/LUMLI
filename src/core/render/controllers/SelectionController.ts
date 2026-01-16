import KeyboardController from "./KeyboardController";
import { EventBus } from "../EventBus";
import Event from "../EventNames";
import EventPayload from "../interfaces/EventPayload";
import EntityBase from "../entities/EntityBase";

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
        const entity = payload.target;
        
        if (!entity) return;

        if (this.inputState.isCtrlPressed()) {
            this.addToSelection(entity);
        }

        this.emitSelectionChanged();
    }

    private addToSelection(entity: EntityBase) {
        this.selected.push(entity);
        this.eventBus.trigger(
            Event.selection.SELECT,
            new EventPayload(undefined, this.selected.find(e => e.id === entity.id))
        );
    }

    private emitSelectionChanged() {
        this.eventBus.trigger(
            Event.selection.CHANGED,
            new EventPayload(undefined, undefined) // We'll handle data differently
        );
    }

    private getEntityReference(entityId: string): any {
        // This is a placeholder - in reality you'd get this from your entity registry
        return { id: entityId };
    }

    public clearSelection(): void {
        this.selected.length = 0;
        this.eventBus.trigger(Event.selection.CLEAR, new EventPayload());
    }
}