import StateController from "../state/StateController";
import Context from "../app/Context";

export default class KeyboardStateController extends StateController {
    constructor(context: Context) {
        super(context);

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
                this.context.__appState.keyboard.ctrlPressed = true;
                break;
            case 'Shift':
                this.context.__appState.keyboard.shiftPressed = true;
                break;
            case 'Alt':
                this.context.__appState.keyboard.altPressed = true;
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
                this.context.__appState.keyboard.ctrlPressed = false;
                break;
            case 'Shift':
                this.context.__appState.keyboard.shiftPressed = false;
                break;
            case 'Alt':
                this.context.__appState.keyboard.altPressed = false;
                break;
            default:
                console.log(event.key);
                break;
        }
    }

    private clearAll() {
        this.context.__appState.keyboard.ctrlPressed = false;
        this.context.__appState.keyboard.shiftPressed = false;
        this.context.__appState.keyboard.altPressed = false;
    }

    public isCtrlPressed(): boolean {
        return this.context.__appState.keyboard.ctrlPressed;
    }

    public isShiftPressed(): boolean {
        return this.context.__appState.keyboard.shiftPressed;
    }

    public isAltPressed(): boolean {
        return this.context.__appState.keyboard.altPressed;
    }
}