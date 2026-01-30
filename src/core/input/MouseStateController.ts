import Context from "../app/Context";
import { Event as EventNames } from "../event/EventNames";
import StateController from "../state/StateController";

export default class MouseStateController extends StateController {

    constructor(context: Context) {
        super(context);

        this.setupListeners();
    }

    protected listenToEvents(): void { }

    private setupListeners(): void {
        const diagram = document.getElementById('diagram');

        diagram?.addEventListener('click', (event: Event) => {
            if (event.target === diagram) {
                this.context.__eventBus.trigger(EventNames.global.CONTAINER_CLICK);
            }
        });
    }

}