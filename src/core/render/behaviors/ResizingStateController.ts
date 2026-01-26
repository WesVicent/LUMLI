import * as d3 from "d3";
import StateController from "../../state/StateController";
import Entity from "../entities/Entity";
import { EventBus } from "../../event/EventBus";
import { Event } from "../../event/EventNames";
import EventPayload from "../../event/types/EventPayload";
import AppState from "../../state/AppState";

interface EntityInitialState { // Remove from here
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;

    relativeX: number;
    relativeY: number;
}

interface BoundaryBox { // Remove from here
    x: number;
    y: number;
    width: number;
    height: number;
    right: number;
    bottom: number;
}

export default class ResizingStateController extends StateController {
    private readonly MIN_WIDTH = 40;
    private readonly MIN_HEIGHT = 40;

    private initialEntityStates: Map<string, EntityInitialState> = new Map();
    private initialBoundaryBox: BoundaryBox | null = null;
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
    }

    private handleOnResizeStart(payload: EventPayload) {
        const event = payload.event!;
        event.sourceEvent.stopPropagation();
        this.isResizing = true;

        this.resizeDirection = d3.select(event.sourceEvent.target as SVGRectElement)
            .attr('class')
            .split(' ')
            .find(className => className.startsWith('resize-'))
            ?.replace('resize-', '') || null;

        this.storeInitialStates();
    }

    private storeInitialStates(): void { // Move to SelectionStateController
        const selected = this.appState.selectedEntities;
        this.initialEntityStates.clear();

        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        selected.forEach(entity => {
            minX = Math.min(minX, entity.x);
            maxX = Math.max(maxX, entity.x + entity.width);
            minY = Math.min(minY, entity.y);
            maxY = Math.max(maxY, entity.y + entity.height);
        });

        this.initialBoundaryBox = {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
            right: maxX,
            bottom: maxY
        };

        selected.forEach(entity => {
            const relativeX = entity.x - this.initialBoundaryBox!.x;
            const relativeY = entity.y - this.initialBoundaryBox!.y;

            this.initialEntityStates.set(entity.id, {
                id: entity.id,
                x: entity.x,
                y: entity.y,
                width: entity.width,
                height: entity.height,
                relativeX: relativeX,
                relativeY: relativeY
            });
        });
    }

    private handleOnResizing(payload: EventPayload) {
        if (!this.isResizing || !this.resizeDirection) return;

        this.handleResize(payload);
    }

    private handleResize(payload: EventPayload) {
        if (!this.initialBoundaryBox) return;

        const selected = this.appState.selectedEntities;

        switch (this.resizeDirection) {
            case this.RESIZING_NODES_CLASS_SULFIX.right:
                this.resizeRight(payload, selected);
                break;
            case this.RESIZING_NODES_CLASS_SULFIX.left:
                this.resizeLeft(payload, selected);
                break;
            case this.RESIZING_NODES_CLASS_SULFIX.bottom:
                this.resizeBottom(payload, selected);
                break;
            case this.RESIZING_NODES_CLASS_SULFIX.top:
                this.resizeTop(payload, selected);
                break;
            case this.RESIZING_NODES_CLASS_SULFIX.topRight:
                this.resizeTop(payload, selected);
                this.resizeRight(payload, selected);
                break;
            case this.RESIZING_NODES_CLASS_SULFIX.topLeft:
                this.resizeTop(payload, selected);
                this.resizeLeft(payload, selected);
                break;
            case this.RESIZING_NODES_CLASS_SULFIX.bottomLeft:
                this.resizeBottom(payload, selected);
                this.resizeLeft(payload, selected);
                break;
            case this.RESIZING_NODES_CLASS_SULFIX.bottomRight:
                this.resizeBottom(payload, selected);
                this.resizeRight(payload, selected);
                break;
        }

        this.updateEntities();
        this.updateBoundaryBox(payload.target as Entity);
    }

    private updateEntities(): void {
        this.appState.selectedEntities.forEach(entity => {
            entity.transform(entity.x, entity.y, entity.width, entity.height);
        });
    }

    private updateBoundaryBox(boundaryBox: Entity): void {
        const selected = this.appState.selectedEntities;
        if (selected.length === 0) return;

        let maxX = -Infinity;
        let minX = Infinity;

        let maxY = -Infinity;
        let minY = Infinity;

        selected.forEach(entity => {
            maxX = Math.max(maxX, entity.x + entity.width);
            minX = Math.min(minX, entity.x);
            maxY = Math.max(maxY, entity.y + entity.height);
            minY = Math.min(minY, entity.y);
        });

        boundaryBox.x = minX;
        boundaryBox.y = minY;
        boundaryBox.width = Math.max(this.MIN_WIDTH * selected.length, maxX - minX);
        boundaryBox.height = Math.max(this.MIN_HEIGHT * selected.length, maxY - minY);

        boundaryBox.transform(boundaryBox.x, boundaryBox.y, boundaryBox.width, boundaryBox.height);
    }

    private resizeRight(payload: EventPayload, selected: Entity[]): void {
        if (!this.initialBoundaryBox) return;

        const deltaX = payload.event!.x - this.initialBoundaryBox.right;
        const scaleX = 1 + (deltaX / this.initialBoundaryBox.width);

        selected.forEach(entity => {
            const initialState = this.initialEntityStates.get(entity.id);
            if (!initialState) return;

            if(initialState.width * scaleX >= this.MIN_WIDTH) { 
                entity.x = this.initialBoundaryBox!.x + (initialState.relativeX * scaleX);
                entity.width = Math.max(this.MIN_WIDTH, initialState.width * scaleX);
            }
        });
    }

    private resizeLeft(payload: EventPayload, selected: Entity[]): void {
        if (!this.initialBoundaryBox) return;

        const deltaX = payload.event!.x - this.initialBoundaryBox.x;
        const scaleX = 1 - (deltaX / this.initialBoundaryBox.width);

        selected.forEach(entity => {
            const initialState = this.initialEntityStates.get(entity.id);
            if (!initialState) return;

            if(initialState.width * scaleX >= this.MIN_WIDTH) {
                const newLeftEdge = this.initialBoundaryBox!.x + deltaX;
                const offsetFromLeft = initialState.x - this.initialBoundaryBox!.x;
    
                entity.x = newLeftEdge + (offsetFromLeft * scaleX);
                entity.width = Math.max(this.MIN_WIDTH, initialState.width * scaleX);
            }
        });
    }

    private resizeBottom(payload: EventPayload, selected: Entity[]): void {
        if (!this.initialBoundaryBox) return;

        const deltaY = payload.event!.y - this.initialBoundaryBox.bottom;
        const scaleY = 1 + (deltaY / this.initialBoundaryBox.height);

        selected.forEach(entity => {
            const initialState = this.initialEntityStates.get(entity.id);
            if (!initialState) return;

            if(initialState.height * scaleY >= this.MIN_WIDTH) {
                entity.y = this.initialBoundaryBox!.y + (initialState.relativeY * scaleY);
                entity.height = Math.max(this.MIN_HEIGHT, initialState.height * scaleY);
            }

        });

    }

    private resizeTop(payload: EventPayload, selected: Entity[]): void {
        if (!this.initialBoundaryBox) return;

        const deltaY = payload.event!.y - this.initialBoundaryBox.y;
        const scaleY = 1 - (deltaY / this.initialBoundaryBox.height);

        selected.forEach(entity => {
            const initialState = this.initialEntityStates.get(entity.id);
            if (!initialState) return;

            if(initialState.height * scaleY >= this.MIN_WIDTH) {
                const newTopEdge = this.initialBoundaryBox!.y + deltaY;
                const offsetFromTop = initialState.y - this.initialBoundaryBox!.y;
    
                entity.y = newTopEdge + (offsetFromTop * scaleY);
                entity.height = Math.max(this.MIN_HEIGHT, initialState.height * scaleY);
            }
        });

    }

    private handleOnResizeEnd(payload: EventPayload) {
        this.isResizing = false;
        this.resizeDirection = null;
        this.initialBoundaryBox = null;
        this.initialEntityStates.clear();

        if (payload.target) {
            payload.target!.x += payload.event!.dx;
            payload.target!.y += payload.event!.dy;
        }
    }
}