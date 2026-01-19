import * as d3 from "d3"; // TODO: remove from here
import RenderService from "../../engines/d3/RenderService";
import IdAndPositions from "../interfaces/IdAndPositions";
import Entity from "../Entity";
import EntityBase from "../types/EntityBase";
import { EventBus } from "../../../event/EventBus";
import Event from "../../../event/EventNames";
import EventPayload from "../../../event/types/EventPayload";

export default class BoundaryBox extends Entity {
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

        this.eventBus.listen(Event.selection.SELECT, this.handleSelectionChange.bind(this));
        this.eventBus.listen(Event.selection.UNSELECT, this.handleSelectionChange.bind(this));
        this.eventBus.listen(Event.entity.MOVING, this.handleMoving.bind(this));
        this.eventBus.listen(Event.entity.STOP_MOVEMENT, this.handleStopMoving.bind(this));
    }

    protected setSelected(selected: boolean): void {
        this.isSelected = selected;
    }

    public transform(x: number, y: number, width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.translate(x, y);
    }

    private handleSelectionChange(payload: EventPayload): void {
        const target = payload.target as EntityBase;

        this.transform(target.x, target.y, target.width, target.height);

        this.isNodesVisible(true);
    }

    private handleMoving(payload: EventPayload) {
        const target = payload.target! as Entity;

        this.isNodesVisible(false);
        this.translate(target.x, target.y);
    }

    private handleStopMoving() {
        this.isNodesVisible(true);
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
        // Box
        this.renderService.drawPrimitiveRect(this.x, this.y, this.width, this.height)
            .attr('id', 'b-box')
            .attr('visibility', 'hidden')
            .attr('display', 'none')
            .attr('stroke', '#096bc7')
            .attr('fill', 'none')
            .attr('stroke-width', 2)
            .style('cursor', 'grab')
            .style("pointer-events", "all")
            .lower();


        this.nodes.forEach(node => {
            this.renderService.drawPrimitiveRect(
                node.x - this.RESIZING_NODES_SIZE / 2,
                node.y - this.RESIZING_NODES_SIZE / 2,
                this.RESIZING_NODES_SIZE,
                this.RESIZING_NODES_SIZE,
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

        this.renderService.select<SVGRectElement>('#b-box')
            .attr('x', this.x)
            .attr('y', this.y)
            .attr('width', this.width)
            .attr('height', this.height);

        this.renderService.select<SVGRectElement>('.resize-topLeft').attr('x', this.x - this.RESIZING_NODES_SIZE / 2).attr('y', this.y - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select<SVGRectElement>('.resize-top').attr('x', this.x + (this.width / 2) - this.RESIZING_NODES_SIZE / 2).attr('y', this.y - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select<SVGRectElement>('.resize-topRight').attr('x', (this.x + this.width) - this.RESIZING_NODES_SIZE / 2).attr('y', this.y - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select<SVGRectElement>('.resize-right').attr('x', (this.x + this.width) - this.RESIZING_NODES_SIZE / 2).attr('y', this.y + (this.height / 2) - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select<SVGRectElement>('.resize-bottomRight').attr('x', (this.x + this.width) - this.RESIZING_NODES_SIZE / 2).attr('y', (this.y + this.height) - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select<SVGRectElement>('.resize-bottom').attr('x', this.x + (this.width / 2) - this.RESIZING_NODES_SIZE / 2).attr('y', (this.y + this.height) - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select<SVGRectElement>('.resize-bottomLeft').attr('x', this.x - this.RESIZING_NODES_SIZE / 2).attr('y', (this.y + this.height) - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select<SVGRectElement>('.resize-left').attr('x', this.x - this.RESIZING_NODES_SIZE / 2).attr('y', this.y + (this.height / 2) - this.RESIZING_NODES_SIZE / 2);
    }

    private isBoxVisible(visible: boolean): void {
        const box = this.renderService.select<SVGRectElement>('#b-box');        

        if (visible) {
            box.attr('visibility', 'visible')
                .attr('display', 'block')
                .lower();
            return;
        }

        box.attr('display', 'none');
    }

    private isNodesVisible(visible: boolean): void {    
        this.isBoxVisible(visible);
        const nodes = this.renderService.selectAll('#rsz-node');

        if (visible) {
            nodes.attr('display', 'block');
            return;
        }

        nodes.attr('display', 'none');
    }

    private setupDragHandler(): void {
        const dragHandler = d3.drag<SVGGElement, unknown, void>()
            .on('start', (event: d3.D3DragEvent<SVGGElement, unknown, void>) => {
                this.emitStartResize(new EventPayload(event, this));
            })
            .on('drag', (event: d3.D3DragEvent<SVGGElement, unknown, void>) => {
                this.emitResizing(new EventPayload(event, this));
                this.translate();
            })
            .on('end', (event: d3.D3DragEvent<SVGGElement, unknown, void>) => {
                this.emitStopResize(new EventPayload(event, this));
            });

        this.renderService.selectAll<SVGGElement>('#rsz-node')
            .call(dragHandler);
    }
}