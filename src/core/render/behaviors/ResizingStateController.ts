import * as d3 from "d3";
import StateController from "../../state/StateController";
import Entity from "../entities/Entity";
import { EventBus } from "../../event/EventBus";
import {Event} from "../../event/EventNames";
import EventPayload from "../../event/types/EventPayload";
import AppState from "../../state/AppState";

export default class ResizingStateController extends StateController {
    private readonly MIN_WIDTH = 40;
    private readonly MIN_HEIGHT = 40;

    private refId: string | undefined;
    private refWidth = 0;
    private refHeight = 0;
    private refX = 0;
    private refY = 0;

    private isResizing = false;
    private resizeDirection: string | null = null;

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

    constructor(eventBus: EventBus, appState: AppState) {
        super(eventBus, appState);
    }

    protected listenToEvents(): void {
        this.listen(Event.entity.START_RESIZE, this.handleOnResizeStart.bind(this));
        this.listen(Event.entity.RESIZING, this.handleOnResizing.bind(this));
        this.listen(Event.entity.STOP_RESIZE, this.handleOnResizeEnd.bind(this));
        this.listen(Event.entity.CLICK_DOWN, this.handleOnFocus.bind(this));
    }

    private handleOnFocus(payload: EventPayload) {
        this.refId = (payload.target as Entity)?.id;
        this.refWidth = payload.target!.width;
        this.refHeight = payload.target!.height;
        this.refX = payload.target!.x;
        this.refY = payload.target!.y;
    }

    private handleOnResizeStart(payload: EventPayload) {
        const event = payload.event!;

        event.sourceEvent.stopPropagation();

        this.isResizing = true;

        (payload.target as Entity)!.id = this.refId || '';

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
    }

    private handleOnResizeEnd(payload: EventPayload) {
        this.isResizing = false;
        this.resizeDirection = null;
        payload.target!.x += payload.event!.dx;
        payload.target!.y += payload.event!.dy;
    }

    private resizeTop(payload: EventPayload): void {
        const newHeight = this.refHeight - (payload.event!.y - this.refY);

        if (newHeight >= this.MIN_HEIGHT) {
            payload.target!.y = payload.event!.y;
            payload.target!.height = newHeight;
        } else {
            payload.target!.y = this.refY + (this.refHeight - this.MIN_HEIGHT);
            payload.target!.height = this.MIN_HEIGHT;
        }

        this.refHeight = payload.target!.height;
        this.refY = payload.target!.y;
    }

    private resizeRight(payload: EventPayload): void {
        if (this.refX + this.refWidth > this.MIN_WIDTH) {
            payload.target!.width = Math.max(this.MIN_WIDTH, payload.event!.x - this.refX);
            this.refWidth = payload.target!.width;
        }
    }

    private resizeBottom(payload: EventPayload): void {
        if (this.refY + this.refHeight > this.MIN_HEIGHT) {
            payload.target!.height = Math.max(this.MIN_HEIGHT, payload.event!.y - this.refY);
            this.refHeight = payload.target!.height;
        }
    }

    private resizeLeft(payload: EventPayload): void {
        const newWidth = this.refWidth - (payload.event!.x - this.refX);

        if (newWidth >= this.MIN_WIDTH) {
            payload.target!.x = payload.event!.x;
            payload.target!.width = newWidth;
        } else {
            payload.target!.x = this.refX + (this.refWidth - this.MIN_WIDTH);
            payload.target!.width = this.MIN_WIDTH;
        }

        this.refWidth = payload.target!.width;
        this.refX = payload.target!.x;
    }
}