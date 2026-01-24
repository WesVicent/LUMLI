import Context from '../../app/Context';
import { EventBus } from '../../event/EventBus';
import { Event } from '../../event/EventNames';
import EventPayload from '../../event/types/EventPayload';
import RenderService from '../engines/d3/RenderService';
import EntityBase from './types/EntityBase';

export default abstract class Entity extends EntityBase {
  protected context: Context;
  protected eventBus: EventBus;
  
  protected isSelected: boolean = false;

  public renderService: RenderService; // Should e public?
  public id: string;
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  constructor(context: Context, id: string, x: number, y: number, width: number, height: number, eventBus: EventBus, renderService: RenderService) {
    super(id, x, y, width, height);

    this.context = context;
    this.eventBus = eventBus;
    this.renderService = renderService;
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.eventBus.listen(Event.selection.SELECT, this.onSelected.bind(this));
    this.eventBus.listen(Event.selection.UNSELECT, this.onUnselected.bind(this));
    this.eventBus.listen(Event.selection.CLEAR, this.onSelectionClear.bind(this));
  }

  protected emitClickUp(event?: LumMultiDragEvent) {
    this.emit(Event.entity.CLICK_UP, new EventPayload(event as D3DragGroupEvent | undefined, this));
  }  
  
  protected emitClickDown(event?: LumMultiDragEvent) {
    this.emit(Event.entity.CLICK_DOWN, new EventPayload(event as D3DragGroupEvent | undefined, this));
  }

  private onSelected(payload: EventPayload) {        
     
    if ((payload.target as Entity)?.id === this.id) {
      this.isSelected = true;
      this.setSelected(true);
    }
  }

  private onUnselected(payload: EventPayload) {    
    
    if ((payload.target as Entity)?.id === this.id) {
      this.isSelected = false;
      this.setSelected(false);
    }
  }

  private onSelectionClear() {    
    this.isSelected = false;
    this.setSelected(false);
  }

  private emit(event: number, data: any) {
    this.eventBus.trigger(event, { entityId: this.id, ...data });
  }
  
  public abstract draw(): void;
  
  abstract translate(x: number, y: number): void;

  protected abstract setSelected(selected: boolean): void;

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