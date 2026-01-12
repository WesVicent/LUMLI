import * as d3 from "d3"; // TODO: remove from here
import RenderService from "../../engines/d3/RenderService";
import { EventBus } from "../../EventBus";
import Event from "../../EventNames";
import EventPayload from "../../interfaces/EventPayload";
import IdAndPositions from "../../interfaces/IdAndPositions";
import EntityEventPayload from "../../interfaces/EventPayload";
import EntityBase from "../EntityBase";

export default class ResizeNode extends EntityBase {
    private nodes: Array<IdAndPositions>;

    private readonly RESIZING_NODES_SIZE: number = 8;
    private readonly RESIZING_NODES_CLASS_SULFIX = {
        topLeft: 'topLeft',
        top: 'top',
        topRight: 'topRight',
        right: 'right',
        bottomRight: 'bottomRight',
        bottom: 'bottom',
        bottomLeft: 'bottomLeft',
        left: 'left',
    };

    constructor(id: string, x: number, y: number, width: number, height: number, renderService: RenderService, eventBus: EventBus) {
        super(id, x, y, width, height, eventBus, renderService);

        this.nodes = this.createNodePositionsArray(x, y, width, height);

        this.eventBus.listen(Event.entity.FOCUS, this.handleFocus.bind(this));
        this.eventBus.listen(Event.entity.MOVING, this.handleMoving.bind(this));
        eventBus.listen(Event.key.CTRL_D, this.onCTRLDown.bind(this));
    }

    private onCTRLDown(): void {
        console.log('aobaa');
    }

    private handleFocus(payload: EventPayload) {
        const target = payload.target as EntityBase;

        this.width = payload.target!.width;
        this.height = payload.target!.height;

        this.translate(target.x, target.y);
        this.nodesVisibility(true);
    }

    private handleMoving(payload: EventPayload) {
        const target = payload.target! as EntityBase;

        this.nodesVisibility(false);
        this.translate(target.x, target.y);
    }

    private createNodePositionsArray(x: number, y: number, width: number, height: number): Array<IdAndPositions> {
        return [
            { id: this.RESIZING_NODES_CLASS_SULFIX.topLeft, x: x, y: y },
            { id: this.RESIZING_NODES_CLASS_SULFIX.top, x: x + width / 2, y: y },
            { id: this.RESIZING_NODES_CLASS_SULFIX.topRight, x: x + width, y: y },
            { id: this.RESIZING_NODES_CLASS_SULFIX.right, x: x + width, y: y + height / 2 },
            { id: this.RESIZING_NODES_CLASS_SULFIX.bottomRight, x: x + width, y: y + height },
            { id: this.RESIZING_NODES_CLASS_SULFIX.bottom, x: x + width / 2, y: y + height },
            { id: this.RESIZING_NODES_CLASS_SULFIX.bottomLeft, x: x, y: y + height },
            { id: this.RESIZING_NODES_CLASS_SULFIX.left, x: x, y: y + height / 2 },
        ];
    }

    private getResizeCursor(direction: string): string {
        const cursors: { [key: string]: string } = {
            [this.RESIZING_NODES_CLASS_SULFIX.top]: 'ns-resize',
            [this.RESIZING_NODES_CLASS_SULFIX.bottom]: 'ns-resize',
            [this.RESIZING_NODES_CLASS_SULFIX.right]: 'ew-resize',
            [this.RESIZING_NODES_CLASS_SULFIX.left]: 'ew-resize',
            [this.RESIZING_NODES_CLASS_SULFIX.topRight]: 'nesw-resize',
            [this.RESIZING_NODES_CLASS_SULFIX.topLeft]: 'nwse-resize',
            [this.RESIZING_NODES_CLASS_SULFIX.bottomRight]: 'nwse-resize',
            [this.RESIZING_NODES_CLASS_SULFIX.bottomLeft]: 'nesw-resize'
        };

        return cursors[direction] || 'default';
    }

    public draw(): void {
        this.nodes.forEach(node => {
            this.renderService.drawPrimitiveRect(
                node.x - this.RESIZING_NODES_SIZE / 2,
                node.y - this.RESIZING_NODES_SIZE / 2,
                this.RESIZING_NODES_SIZE,
                this.RESIZING_NODES_SIZE,
                // this.card.localGroup
            )
                .attr('id', 'rsz-node')
                .attr('class', `handle-resiz resize-${node.id}`)
                .attr('fill', '#096bc7')
                .attr('stroke', '#ffffff')
                .attr('stroke-width', 1)
                .attr('rx', 1)
                .attr('display', 'none')
                .style('cursor', this.getResizeCursor(node.id));
        });

        this.setupDragHandler();
    }

    public translate(x?: number, y?: number): void {
        this.x = x || this.x;
        this.y = y || this.y;

        this.renderService.select<SVGRectElement>('.resize-topLeft').attr('x', this.x - this.RESIZING_NODES_SIZE / 2).attr('y', this.y - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select<SVGRectElement>('.resize-top').attr('x', this.x + (this.width / 2) - this.RESIZING_NODES_SIZE / 2).attr('y', this.y - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select<SVGRectElement>('.resize-topRight').attr('x', (this.x + this.width) - this.RESIZING_NODES_SIZE / 2).attr('y', this.y - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select<SVGRectElement>('.resize-right').attr('x', (this.x + this.width) - this.RESIZING_NODES_SIZE / 2).attr('y', this.y + (this.height / 2) - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select<SVGRectElement>('.resize-bottomRight').attr('x', (this.x + this.width) - this.RESIZING_NODES_SIZE / 2).attr('y', (this.y + this.height) - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select<SVGRectElement>('.resize-bottom').attr('x', this.x + (this.width / 2) - this.RESIZING_NODES_SIZE / 2).attr('y', (this.y + this.height) - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select<SVGRectElement>('.resize-bottomLeft').attr('x', this.x - this.RESIZING_NODES_SIZE / 2).attr('y', (this.y + this.height) - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select<SVGRectElement>('.resize-left').attr('x', this.x - this.RESIZING_NODES_SIZE / 2).attr('y', this.y + (this.height / 2) - this.RESIZING_NODES_SIZE / 2);
    }

    private nodesVisibility(visible: boolean): void {
        if (visible) {
            this.renderService.selectAll('#rsz-node').attr('display', 'block');
            return;
        }

        this.renderService.selectAll('#rsz-node').attr('display', 'none');
    }

    private setupDragHandler(): void {
        const dragHandler = d3.drag<SVGGElement, unknown, void>()
            .on('start', (event: d3.D3DragEvent<SVGGElement, unknown, void>) => {
                this.emitStartResize(new EntityEventPayload(event, this));
            })
            .on('drag', (event: d3.D3DragEvent<SVGGElement, unknown, void>) => {
                this.emitResizing(new EntityEventPayload(event, this));
                this.translate();
            })
            .on('end', (event: d3.D3DragEvent<SVGGElement, unknown, void>) => {
                this.emitStopResize(new EntityEventPayload(event, this));
            });

        this.renderService.selectAll<SVGGElement>('#rsz-node')
            .call(dragHandler);
    }
}