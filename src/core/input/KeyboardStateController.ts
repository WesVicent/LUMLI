import AppState from "../state/AppState";
import { EventBus } from "../event/EventBus";
import StateController from "../state/StateController";

export default class KeyboardStateController extends StateController {
    constructor(eventBus: EventBus, appState: AppState) {
        super(eventBus, appState);

        this.setupListeners();
    }

    protected listenToEvents(): void { }

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
                this.appState.keyboard.ctrlPressed = true;
                break;
            case 'Shift':
                this.appState.keyboard.shiftPressed = true;
                break;
            case 'Alt':
                this.appState.keyboard.altPressed = true;
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
                this.appState.keyboard.ctrlPressed = false;
                break;
            case 'Shift':
                this.appState.keyboard.shiftPressed = false;
                break;
            case 'Alt':
                this.appState.keyboard.altPressed = false;
                break;
            default:
                console.log(event.key);
                break;
        }
    }

    private clearAll() {
        this.appState.keyboard.ctrlPressed = false;
        this.appState.keyboard.shiftPressed = false;
        this.appState.keyboard.altPressed = false;
    }

    public isCtrlPressed(): boolean {
        return this.appState.keyboard.ctrlPressed;
    }

    public isShiftPressed(): boolean {
        return this.appState.keyboard.shiftPressed;
    }

    public isAltPressed(): boolean {
        return this.appState.keyboard.altPressed;
    }
}