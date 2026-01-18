import AppState from './AppState';
import { EventBus } from '../event/EventBus';
import EventPayload from '../event/types/EventPayload';

export default abstract class StateController {
  protected appState: AppState;
  protected eventBus: EventBus;

  constructor(eventBus: EventBus, appState: AppState) {
    this.appState = appState;
    this.eventBus = eventBus;
    this.listenToEvents();
  }

  protected abstract listenToEvents(): void;

  protected listen(event: number, handler: (payload: EventPayload) => void) {
    this.eventBus.listen(event, handler);
  }

  protected trigger(event: number, payload: EventPayload) {
    this.eventBus.trigger(event, payload);
  }
}