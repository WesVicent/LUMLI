import { EventBus } from "../event/EventBus";
import { Event as EventNames } from "../event/EventNames";
import AppState from "../state/AppState";
import StateController from "../state/StateController";

export default class MouseStateController extends StateController {

    constructor(eventBus: EventBus, appState: AppState) {
        super(eventBus, appState);

        this.setupListeners();
    }

    protected listenToEvents(): void { }

    private setupListeners(): void {
        const diagram = document.getElementById('diagram');

        diagram?.addEventListener('click', (event: Event) => {
            if (event.target === diagram) {
                this.eventBus.trigger(EventNames.global.CONTAINER_CLICK);
            }
        });
    }

}