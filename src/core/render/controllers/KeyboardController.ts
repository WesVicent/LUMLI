import { EventBus } from "../EventBus";
import Event from "../EventNames";
import EventPayload from "../interfaces/EventPayload";

export default class KeyboardController {
    private ctrlPressed: boolean = false;
    private shiftPressed: boolean = false;
    private altPressed: boolean = false;

    constructor(private eventBus: EventBus) {
        this.setupListeners();
    }

    private setupListeners(): void {
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

        window.addEventListener('blur', this.clearAll.bind(this));
    }

    private handleKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'Control':
            case 'Meta':
                this.ctrlPressed = true;
                break;
            case 'Shift':
                this.shiftPressed = true;
                break;
            case 'Alt':
                this.altPressed = true;
                break;

            default:
                console.log(event.key);
                break;
        }
    }

    private handleKeyUp(event: KeyboardEvent): void {
        switch (event.key) {
            case 'Control':
            case 'Meta':
                this.ctrlPressed = false;
                this.eventBus.trigger(Event.key.CTRL_U, new EventPayload());
                break;
            case 'Shift':
                this.shiftPressed = false;
                break;
            case 'Alt':
                this.altPressed = false;
                break;
            default:
                console.log(event.key);
                break;
        }
    }

    private clearAll() {
        this.ctrlPressed = false;
        this.shiftPressed = false;
        this.altPressed = false;
    }

    public isCtrlPressed(): boolean {
        return this.ctrlPressed;
    }

    public isShiftPressed(): boolean {
        return this.shiftPressed;
    }

    public isAltPressed(): boolean {
        return this.altPressed;
    }
}