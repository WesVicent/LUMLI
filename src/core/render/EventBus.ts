import EventPayload from "./interfaces/EventPayload";

type EventHandler = (payload: EventPayload) => void;

export class EventBus {
  private events: Map<number, EventHandler[]> = new Map();

  listen(event: number, callback: EventHandler) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    this.events.get(event)!.push(callback);
  }

  trigger(event: number, payload?: EventPayload) {
    const handlers = this.events.get(event);

    payload = payload ? payload : new EventPayload();
    
    handlers && handlers.forEach(handler => handler(payload));
  }

  ignore(event: number, callback: EventHandler) {
    const handlers = this.events.get(event);
    if (handlers) {
      this.events.set(event, handlers.filter(h => h !== callback));
    }
  }
}