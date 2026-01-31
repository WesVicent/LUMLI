import * as d3 from "d3";
import Context from "../../../app/Context";
import RenderService from "../../engines/d3/RenderService";
import Entity from "../Entity";
import EventPayload from "../../../event/types/EventPayload";

export default class LumArrow extends Entity {
    public localGroup!: D3GElementSelection;

    private line!: D3LineElementSelection;
    private arrowHead!: D3PolygonElementSelection;

    private isDragging = false;
    private dragStartPos!: { x: number; y: number };

    // Arrow properties
    private arrowHeadSize = 10;
    private strokeWidth = 2;
    private strokeColor = '#3d3d3dff';

    private endX: number;
    private endY: number;

    constructor(context: Context, id: string, x: number, y: number, endX: number, endY: number, renderService: RenderService) {
        const width = Math.abs(endX - x);
        const height = Math.abs(endY - y);

        super(context, id, x, y, width, height, renderService);

        this.endX = endX - x;
        this.endY = endY - y;
    }

    public draw(): void {
        this.localGroup = this.renderService.createPrimitiveGroup(this.id, this.x, this.y, this.width, this.height);

        this.line = this.renderService.drawPrimitiveLine(0, 0, this.endX, this.endY, this.localGroup);

        this.arrowHead = this.createArrowHead();

        this.updateStyle();

        this.setupDragHandler();
    }

    public remove(): void {
        this.line.remove();
        this.arrowHead.remove();
    }

    public transform(x: number, y: number, endX: number, endY: number): void {
        this.x = x;
        this.y = y;

        this.endX = endX - x;
        this.endY = endY - y;

        this.width = Math.abs(this.endX);
        this.height = Math.abs(this.endY);

        this.localGroup.attr("transform", `translate(${this.x}, ${this.y})`);

        this.line
            .attr('x2', this.endX)
            .attr('y2', this.endY);

        this.updateArrowHead();
    }

    public getEndPoints(): { start: { x: number; y: number }; end: { x: number; y: number } } {
        return {
            start: { x: this.x, y: this.y },
            end: { x: this.x + this.endX, y: this.y + this.endY }
        };
    }

    public translate(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.localGroup.attr("transform", `translate(${x}, ${y})`);
    }

    public highlight(highlight: boolean): void {
        const color = highlight ? this.context.COLORS.blue : '#3d3d3dff';
        const width = highlight ? 3 : this.strokeWidth;

        this.line
            .style("stroke", color)
            .style("stroke-width", width);

        this.arrowHead
            .style("fill", color);
    }

    protected setSelected(selected: boolean): void {
        this.highlight(selected);
    }

    private createArrowHead(): D3PolygonElementSelection {
        const angle = Math.atan2(this.endY, this.endX);

        // Arrow head points (relative to end point)
        const points = [
            [0, 0],
            [-this.arrowHeadSize, -this.arrowHeadSize / 2],
            [-this.arrowHeadSize, this.arrowHeadSize / 2]
        ];

        const rotatedPoints = points.map(([x, y]) => {
            const rotatedX = x * Math.cos(angle) - y * Math.sin(angle);
            const rotatedY = x * Math.sin(angle) + y * Math.cos(angle);
            return [rotatedX + this.endX, rotatedY + this.endY];
        });

        const pointsString = rotatedPoints.map(p => p.join(',')).join(' ');

        return this.localGroup
            .append('polygon')
            .attr('points', pointsString);
    }

    private updateArrowHead(): void {
        const angle = Math.atan2(this.endY, this.endX);

        // Arrow head points (relative to end point)
        const points = [
            [0, 0],
            [-this.arrowHeadSize, -this.arrowHeadSize / 2],
            [-this.arrowHeadSize, this.arrowHeadSize / 2]
        ];

        const rotatedPoints = points.map(([x, y]) => {
            const rotatedX = x * Math.cos(angle) - y * Math.sin(angle);
            const rotatedY = x * Math.sin(angle) + y * Math.cos(angle);
            return [rotatedX + this.endX, rotatedY + this.endY];
        });

        const pointsString = rotatedPoints.map(p => p.join(',')).join(' ');

        this.arrowHead.attr('points', pointsString);
    }

    private updateStyle(): void {
        this.line
            .style("stroke", this.strokeColor)
            .style("stroke-width", this.strokeWidth)
            .style("fill", "none");

        this.arrowHead
            .style("fill", this.strokeColor);
    }

    private setupDragHandler(): void {
        const dragHandler = d3.drag<SVGGElement, unknown, void>()
            .filter(() => true)
            .on('start', (event: d3.D3DragEvent<SVGGElement, unknown, void>) => {
                this.dragStartPos = { x: event.x, y: event.y };
                this.emitClickDown(event);
            })
            .on('drag', (event: d3.D3DragEvent<SVGGElement, unknown, void>) => {
                const dx = Math.abs(event.x - this.dragStartPos.x);
                const dy = Math.abs(event.y - this.dragStartPos.y);

                if (!this.isDragging && (dx > 5 || dy > 5)) {
                    this.isDragging = true;
                    this.emitStartMove(new EventPayload(event, this));
                }

                if (this.isDragging) {
                    this.emitMoving(new EventPayload(event, this));
                }
            })
            .on('end', (event: d3.D3DragEvent<SVGGElement, unknown, void>) => {
                if (this.isDragging) {
                    this.emitStopMove(new EventPayload(event, this));
                }

                this.emitClickUp(event);
                this.dragStartPos = undefined as any;
                this.isDragging = false;
            });

        this.localGroup.call(dragHandler);
    }
}