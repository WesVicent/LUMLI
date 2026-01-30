import EventPayload from '../event/types/EventPayload';
import Context from '../app/Context';

export default abstract class StateController {
  protected context: Context;

  constructor(context: Context) {
    this.context = context;

    this.listenToEvents();
  }

  protected abstract listenToEvents(): void;

  protected listen(event: number, handler: (payload: EventPayload) => void) {
    this.context.__eventBus.listen(event, handler);
  }

  protected trigger(event: number, payload: EventPayload) {
    this.context.__eventBus.trigger(event, payload);
  }
}