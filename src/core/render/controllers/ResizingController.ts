import * as d3 from "d3";
import IdAndPositions from "../interfaces/IdAndPositions";
import Controller from "./ControllerBase";
import { EventBus } from "../EventBus";
import EventPayload from "../interfaces/EventPayload";
import Event from "../EventNames";

export default class ResizingController extends Controller {

    private readonly MIN_WIDTH = 40;
    private readonly MIN_HEIGHT = 40;

    private refId: string | undefined;
    private refWidth = 0;
    private refHeight = 0;
    private refX = 0;
    private refY = 0;

    private isResizing = false;
    private resizeDirection: string | null = null;

    private readonly RESIZING_NODES_SIZE: number = 8;
    private readonly RESIZING_NODES_CLASS_SULFIX = {
        topLeft: 'topLeft',
        top: 'top',
        topRight: 'topRight',
        left: 'left',
        right: 'right',
        bottomLeft: 'bottomLeft',
        bottom: 'bottom',
        bottomRight: 'bottomRight',
    };

    constructor(eventBus: EventBus) {
        super(eventBus);
    }

    protected listenToEvents(): void {
        this.listen(Event.entity.START_RESIZE, this.handleOnResizeStart.bind(this));
        this.listen(Event.entity.RESIZING, this.handleOnResizing.bind(this));
        this.listen(Event.entity.STOP_RESIZE, this.handleOnResizeEnd.bind(this));
        this.listen(Event.entity.FOCUS, this.handleOnFocus.bind(this));
    }

    private handleOnFocus(payload: EventPayload) {
        this.refId = payload.target.id;
        this.refWidth = payload.target.width;
        this.refHeight = payload.target.height;
        this.refX = payload.target.x;
        this.refY = payload.target.y;
    }

    private handleOnResizeStart(payload: EventPayload) {
        const event = payload.event;

        event.sourceEvent.stopPropagation();

        this.isResizing = true;

        this.resizeDirection = d3.select(event.sourceEvent.target as SVGRectElement)
            .attr('class')
            .split(' ')
            .find(className => className.startsWith('resize-'))
            ?.replace('resize-', '') || null;
    }

    private handleOnResizing(payload: EventPayload) {
        if (!this.isResizing || !this.resizeDirection) return;        

        switch (this.resizeDirection) {
            case this.RESIZING_NODES_CLASS_SULFIX.right:
                this.resizeRight(payload);

                break;
            case this.RESIZING_NODES_CLASS_SULFIX.left:
                this.resizeLeft(payload);

                break;
            case this.RESIZING_NODES_CLASS_SULFIX.bottom:
                this.resizeBottom(payload);

                break;
            case this.RESIZING_NODES_CLASS_SULFIX.top:
                this.resizeTop(payload);

                break;
            case this.RESIZING_NODES_CLASS_SULFIX.topRight:
                this.resizeTop(payload);
                this.resizeRight(payload);

                break;
            case this.RESIZING_NODES_CLASS_SULFIX.topLeft:
                this.resizeTop(payload);
                this.resizeLeft(payload);

                break;
            case this.RESIZING_NODES_CLASS_SULFIX.bottomLeft:
                this.resizeBottom(payload);
                this.resizeLeft(payload);

                break;
            case this.RESIZING_NODES_CLASS_SULFIX.bottomRight:
                this.resizeBottom(payload);
                this.resizeRight(payload);

                break;
        }

        // this.card.onResize(this.x, this.y, this.width, this.height);

        // this.updateResizingNodes(payload);
    }

    private handleOnResizeEnd(payload: EventPayload) {
        this.isResizing = false;
        this.resizeDirection = null;
        payload.target.x += payload.event.dx;
        payload.target.y += payload.event.dy;

    }

    private resizeTop(payload: EventPayload): void {
        if (this.refHeight - payload.event.y > this.MIN_HEIGHT) {
            this.refHeight = Math.max(this.MIN_HEIGHT, this.refHeight - payload.event.y);
            this.refY += payload.event.y;

            payload.target.width = this.refWidth;
            payload.target.height = this.refHeight;
            payload.target.y = this.refY;
            payload.target.y = this.refY;
        }
    }
    private resizeRight(payload: EventPayload): void {
        if (this.refX + this.refWidth > this.MIN_WIDTH) {
            this.refWidth = Math.max(this.MIN_WIDTH, payload.event.dx);

            payload.target.width = this.refWidth;
            payload.target.height = this.refHeight;
            payload.target.y = this.refY;
            payload.target.y = this.refY;

             console.log('this.refWidth', this.refWidth);
            console.log('this.refHeight', this.refHeight);
            console.log('this.refY', this.refY);
            console.log('this.refY', this.refY);
            console.log('----------------------');
        }

    }
    private resizeBottom(payload: EventPayload): void {
        if (this.refY + this.refHeight > this.MIN_HEIGHT) {
            this.refHeight = Math.max(this.MIN_HEIGHT, payload.event.y);

            payload.target.width = this.refWidth;
            payload.target.height = this.refHeight;
            payload.target.y = this.refY;
            payload.target.y = this.refY;

           
            
        }
    }
    private resizeLeft(payload: EventPayload): void {
        if (this.refWidth - payload.event.x > this.MIN_WIDTH) {
            this.refWidth = Math.max(this.MIN_WIDTH, this.refWidth - payload.event.x);
            this.refX += payload.event.x;

            payload.target.width = this.refWidth;
            payload.target.height = this.refHeight;
            payload.target.y = this.refY;
            payload.target.y = this.refY;
        }
    }

    // private setupResizeHandler(): void {
    //     const resizeDragHandler = d3.drag<SVGRectElement, unknown, void>()
    //         .on('start', (event: D3DragRectEvent) => {
    //             event.sourceEvent.stopPropagation();

    //             const cardPosition = this.card.getPositionAndSize();

    //             this.x = cardPosition.x;
    //             this.y = cardPosition.y;
    //             this.width = cardPosition.width;
    //             this.height = cardPosition.height;

    //             this.isResizing = true;

    //             this.resizeDirection = d3.select(event.sourceEvent.target as SVGRectElement)
    //                 .attr('class')
    //                 .split(' ')
    //                 .find(className => className.startsWith('resize-'))
    //                 ?.replace('resize-', '') || null;

    //             // this.isBordersHighlighted(true)
    //         })
    //         .on('drag', (event: D3DragRectEvent) => {
    //             if (!this.isResizing || !this.resizeDirection) return;

    //             switch (this.resizeDirection) {
    //                 case this.RESIZING_NODES_CLASS_SULFIX.right:
    //                     this.resizeRight(event);

    //                     break;
    //                 case this.RESIZING_NODES_CLASS_SULFIX.left:
    //                     this.resizeLeft(event);

    //                     break;
    //                 case this.RESIZING_NODES_CLASS_SULFIX.bottom:
    //                     this.resizeBottom(event);

    //                     break;
    //                 case this.RESIZING_NODES_CLASS_SULFIX.top:
    //                     this.resizeTop(event);

    //                     break;
    //                 case this.RESIZING_NODES_CLASS_SULFIX.topRight:
    //                     this.resizeTop(event);
    //                     this.resizeRight(event);

    //                     break;
    //                 case this.RESIZING_NODES_CLASS_SULFIX.topLeft:
    //                     this.resizeTop(event);
    //                     this.resizeLeft(event);

    //                     break;
    //                 case this.RESIZING_NODES_CLASS_SULFIX.bottomLeft:
    //                     this.resizeBottom(event);
    //                     this.resizeLeft(event);

    //                     break;
    //                 case this.RESIZING_NODES_CLASS_SULFIX.bottomRight:
    //                     this.resizeBottom(event);
    //                     this.resizeRight(event);

    //                     break;
    //             }

    //             this.card.onResize(this.x, this.y, this.width, this.height);

    //             this.updateResizingNodes();
    //         })
    //         .on('end', (event: D3DragRectEvent) => {
    //             this.isResizing = false;
    //             this.resizeDirection = null;
    //             this.x += event.dx;
    //             this.y += event.dy;
    //         });


    //     const resizeHandleSelection = d3.selectAll<SVGRectElement, unknown>('.handle-resiz');

    //     resizeDragHandler(resizeHandleSelection);
    // }
}