import { EventBus } from "../event/EventBus";
import EventPayload from "../event/types/EventPayload";
import AppState from "../state/AppState";

export default class Context {
    public __eventBus: EventBus;
    public __appState: AppState;

    public readonly COLORS = {
        white: '#ffffff',
        blue: '#096bc7',
    };

    constructor(eventBus: EventBus, appState: AppState) {
        this.__eventBus = eventBus;
        this.__appState = appState;
    }

    public storeInitialStates(payload: EventPayload): void {
        const selected = this.__appState.selectedEntities;
        this.__appState.initialEntityStates.clear();

        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        selected.forEach(entity => {
            minX = Math.min(minX, entity.x);
            maxX = Math.max(maxX, entity.x + entity.width);
            minY = Math.min(minY, entity.y);
            maxY = Math.max(maxY, entity.y + entity.height);
        });

        this.__appState.initialBoundaryBox = {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
            right: maxX,
            bottom: maxY,
            eventX: payload.event!.x,
            eventY: payload.event!.y
        };

        console.log(this.__appState.initialBoundaryBox);
        

        selected.forEach(entity => {
            const relativeX = entity.x - this.__appState.initialBoundaryBox!.x;
            const relativeY = entity.y - this.__appState.initialBoundaryBox!.y;

            this.__appState.initialEntityStates.set(entity.id, {
                id: entity.id,
                x: entity.x,
                y: entity.y,
                width: entity.width,
                height: entity.height,
                relativeX: relativeX,
                relativeY: relativeY
            });
        });

        console.log(this.__appState.initialEntityStates.get(this.__appState.selectedEntities[0].id));
    }
}