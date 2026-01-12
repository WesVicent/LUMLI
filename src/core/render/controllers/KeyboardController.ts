// KeyboardController.ts
import { EventBus } from "../EventBus";
import Event from "../EventNames";
import ControllerBase from "./ControllerBase";

export default class KeyboardController extends ControllerBase {
    private keyState = new Map<string, boolean>();
    private focusedEntityId: string | null = null;

    constructor(eventBus: EventBus) {
        super(eventBus);
        this.setupKeyboardListeners();
        this.listenToEvents();
    }

    protected listenToEvents(): void {

    }

    private setupKeyboardListeners(): void {
        document.addEventListener('keydown', (event) => {
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
                return;
            }

            if (event.repeat) return;

            this.handleKeyDown(event);
        });

        document.addEventListener('keyup', (e) => {
            this.handleKeyUp(e);
        });
    }

    private handleKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'Control':
                this.eventBus.trigger(Event.key.CTRL_D);
                break;

            default:
                console.log(event.key);
                break;
        }
    }

    private handleKeyUp(event: KeyboardEvent): void {
        switch (event.key) {
            case 'Control':
                break;
            default:
                console.log(event.key);
                break;
        }
    }

    public isKeyPressed(key: string): boolean {
        return this.keyState.get(key) || false;
    }
}