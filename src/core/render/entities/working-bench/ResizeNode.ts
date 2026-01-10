import * as d3 from "d3";
import RenderService from "../../engines/d3/RenderService";
import { EventBus } from "../../EventBus";
import Event from "../../EventNames";
import EventPayload from "../../interfaces/EventPayload";
import IdAndPositions from "../../interfaces/IdAndPositions";
import EntityEventPayload from "../../interfaces/EventPayload";
import EntityBase from "../EntityBase";

export default class ResizeNode extends EntityBase {
    private nodes: Array<IdAndPositions>;
    private renderService: RenderService;

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
        super(id, x, y, width, height, eventBus);

        this.renderService = renderService;
        this.nodes = this.createNodePositionsArray(x, y, width, height);

        this.eventBus.listen(Event.entity.FOCUS, this.handleFocus.bind(this));
        this.eventBus.listen(Event.entity.MOVING, this.handleMoving.bind(this));
    }

    private handleFocus(payload: EventPayload) {
        const target = payload.target as EntityBase;
        
        this.translate(target.x, target.y);
        this.nodesVisibility(true);
    }

    private handleMoving(payload: EventPayload) {
        const target = payload.target as EntityBase;
        
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

    private updateResizingNodes(): void {
        this.nodes.forEach(node => {
            switch (node.id) {
                case this.RESIZING_NODES_CLASS_SULFIX.right:
                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.right}`)
                        .attr('x', this.width - this.RESIZING_NODES_SIZE / 2);

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.topRight}`)
                        .attr('x', this.width - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottomRight}`)
                        .attr('x', this.width - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.top}`)
                        .attr('x', (this.width / 2) - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottom}`)
                        .attr('x', (this.width / 2) - (this.RESIZING_NODES_SIZE / 2));
                    break;
                case this.RESIZING_NODES_CLASS_SULFIX.left:
                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.right}`)
                        .attr('x', this.width - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.topRight}`)
                        .attr('x', this.width - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottomRight}`)
                        .attr('x', this.width - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.top}`)
                        .attr('x', (this.width / 2) - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottom}`)
                        .attr('x', (this.width / 2) - (this.RESIZING_NODES_SIZE / 2));
                    break;
                case this.RESIZING_NODES_CLASS_SULFIX.bottom:
                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottom}`)
                        .attr('y', this.height - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottomRight}`)
                        .attr('y', this.height - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottomLeft}`)
                        .attr('y', this.height - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.right}`)
                        .attr('y', (this.height / 2) - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.left}`)
                        .attr('y', (this.height / 2) - (this.RESIZING_NODES_SIZE / 2));
                    break;
                case this.RESIZING_NODES_CLASS_SULFIX.top:
                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottom}`)
                        .attr('y', this.height - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottomRight}`)
                        .attr('y', this.height - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.bottomLeft}`)
                        .attr('y', this.height - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.right}`)
                        .attr('y', (this.height / 2) - (this.RESIZING_NODES_SIZE / 2));

                    this.renderService.context.getCore().select(`.resize-${this.RESIZING_NODES_CLASS_SULFIX.left}`)
                        .attr('y', (this.height / 2) - (this.RESIZING_NODES_SIZE / 2));
                    break;
            }
        });
    }

    public translate(x?: number, y?: number): void {
        this.x = x || this.x;
        this.y = y || this.y;

        this.renderService.select('.resize-topLeft').attr('x', this.x - this.RESIZING_NODES_SIZE / 2).attr('y', this.y - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select('.resize-top').attr('x', this.x + (this.width / 2) - this.RESIZING_NODES_SIZE / 2).attr('y', this.y - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select('.resize-topRight').attr('x', (this.x + this.width) - this.RESIZING_NODES_SIZE / 2).attr('y', this.y - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select('.resize-right').attr('x', (this.x + this.width) - this.RESIZING_NODES_SIZE / 2).attr('y', this.y +  (this.height / 2) - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select('.resize-bottomRight').attr('x', (this.x + this.width) - this.RESIZING_NODES_SIZE / 2).attr('y', (this.y + this.height) - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select('.resize-bottom').attr('x', this.x + (this.width / 2) - this.RESIZING_NODES_SIZE / 2).attr('y', (this.y + this.height) - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select('.resize-bottomLeft').attr('x', this.x - this.RESIZING_NODES_SIZE / 2).attr('y', (this.y + this.height) - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select('.resize-left').attr('x', this.x - this.RESIZING_NODES_SIZE / 2).attr('y', this.y + (this.height / 2) - this.RESIZING_NODES_SIZE / 2);
    }
    
    public translate2(x?: number, y?: number): void {
        this.x = x || this.x;
        this.y = y || this.y;

        this.renderService.select('.resize-topLeft').attr('x', this.x - this.RESIZING_NODES_SIZE / 2).attr('y', this.y - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select('.resize-top').attr('x', this.x + (this.width / 2) - this.RESIZING_NODES_SIZE / 2).attr('y', this.y - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select('.resize-topRight').attr('x', (this.x + this.width) - this.RESIZING_NODES_SIZE / 2).attr('y', this.y - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select('.resize-right').attr('x', (this.x + this.width) - this.RESIZING_NODES_SIZE / 2).attr('y', 0 + (this.height / 2) - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select('.resize-bottomRight').attr('x', (this.x + this.width) - this.RESIZING_NODES_SIZE / 2).attr('y', (0 + this.height) - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select('.resize-bottom').attr('x', this.x + (this.width / 2) - this.RESIZING_NODES_SIZE / 2).attr('y', (0 + this.height) - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select('.resize-bottomLeft').attr('x', this.x - this.RESIZING_NODES_SIZE / 2).attr('y', (0 + this.height) - this.RESIZING_NODES_SIZE / 2);
        this.renderService.select('.resize-left').attr('x', this.x - this.RESIZING_NODES_SIZE / 2).attr('y', this.y + (this.height / 2) - this.RESIZING_NODES_SIZE / 2);
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
                    this.translate2();
                })
                .on('end', (event: d3.D3DragEvent<SVGGElement, unknown, void>) => {
                    this.emitStopResize(new EntityEventPayload(event, this));
                });
    
            this.renderService.selectAll('#rsz-node')
                .call(dragHandler);
        }
}