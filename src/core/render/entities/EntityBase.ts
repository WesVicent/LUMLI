import RenderService from '../engines/d3/RenderService';
import { EventBus } from '../EventBus';
import Event from '../EventNames';
import EventPayload from '../interfaces/EventPayload';
import Movable from '../interfaces/Movable';
import Resizable from '../interfaces/Resizable';

export default abstract class EntityBase implements Movable, Resizable {
  protected eventBus: EventBus;
  public renderService: RenderService;
  public id: string;
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  constructor(id: string, x: number, y: number, width: number, height: number, eventBus: EventBus, renderService: RenderService) {
    this.eventBus = eventBus;
    this.renderService = renderService;
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public abstract draw(): void;

  abstract translate(x: number, y: number): void;

  private emit(event: number, data: any) {
    this.eventBus.trigger(event, { entityId: this.id, ...data });
  }

  protected emitStartMove(payload: EventPayload) {
    this.emit(Event.entity.START_MOVEMENT, payload);
  }

  protected emitMoving(payload: EventPayload) {
    this.emit(Event.entity.MOVING, payload);
  }

  protected emitStopMove(payload: EventPayload) {
    this.emit(Event.entity.STOP_MOVEMENT, payload);
  }

  protected emitFocus(payload: EventPayload) {
    this.emit(Event.entity.FOCUS, payload);
  }

  protected emitStartResize(payload: EventPayload) {
    this.emit(Event.entity.START_RESIZE, payload);
  }
  
  protected emitResizing(payload: EventPayload) {
    this.emit(Event.entity.RESIZING, payload);
  }
  
  protected emitStopResize(payload: EventPayload) {
    this.emit(Event.entity.STOP_RESIZE, payload);
  }
}