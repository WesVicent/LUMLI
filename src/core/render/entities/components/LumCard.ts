import * as d3 from "d3";
import RenderService from "../../engines/d3/RenderService";
// import LumText from "./LumText";
import EntityBase from "../types/EntityBase";
import Entity from "../Entity";
import EventPayload from "../../../event/types/EventPayload";
import Context from "../../../app/Context";
import LumText from "./LumText";
import LumArrow from "./LumArrow";
import { Event } from "../../../event/EventNames";
import PrimitiveElementPayload from "../interfaces/PrimitiveElementPayload";

export default class LumCard extends Entity {
    public localGroup!: D3GElementSelection;

    private readonly POINTING_NODES_SIZE = 8;

    private pointingNodes!: { top: PrimitiveElementPayload, right: PrimitiveElementPayload, bottom: PrimitiveElementPayload, left: PrimitiveElementPayload };

    private rect!: D3RectElementSelection;
    private line!: D3LineElementSelection;
    private text: LumText;
    private arrow!: LumArrow;

    private dragStartPos!: { x: number, y: number };
    private isDragging = false;

    // Resizing
    private readonly MIN_WIDTH = 40;
    private readonly MIN_HEIGHT = 40;

    constructor(context: Context, id: string, x: number, y: number, width: number, height: number, text: string, renderService: RenderService) {
        super(context, id, x, y, width, height, renderService);

        width = width < this.MIN_WIDTH ? this.MIN_WIDTH : width;
        height = height < this.MIN_HEIGHT ? this.MIN_HEIGHT : height;

        this.width = width;
        this.height = height;

        this.text = new LumText(this.context, this.x, this.y, this.width, this.height, 18, text, this.renderService);
        // this.arrow = new LumArrow(this.context, 'asasasas', 100, 100, 200, 200, this.renderService);

        context.__eventBus.listen(Event.global.ENTER_POINTING_MODE, this.onEnterPointingMode.bind(this));
        context.__eventBus.listen(Event.global.LEAVE_POINTING_MODE, this.onLeavePointingMode.bind(this));
    }

    private onEnterPointingMode() {
        this.pointingNodes.top.element?.attr('display', 'block');
        this.pointingNodes.right.element?.attr('display', 'block');
        this.pointingNodes.bottom.element?.attr('display', 'block');
        this.pointingNodes.left.element?.attr('display', 'block');
    }

    private onLeavePointingMode() {
        this.pointingNodes.top.element?.attr('display', 'none');
        this.pointingNodes.right.element?.attr('display', 'none');
        this.pointingNodes.bottom.element?.attr('display', 'none');
        this.pointingNodes.left.element?.attr('display', 'none');
    }

    public draw(): void {
        this.localGroup = this.renderService.createPrimitiveGroup(this.id, this.x, this.y, this.width, this.height);

        this.rect = this.renderService.drawPrimitiveRect(0, 0, this.width, this.height, this.localGroup);

        this.line = this.renderService.drawPrimitiveLine(0, this.height / 5, this.width, this.height / 5, this.localGroup);

        // GRID ref
        // this.renderService.drawPrimitiveLine(0, this.height / 2, this.width, this.height / 2, this.localGroup).style('stroke', '#7b00ff');
        // this.renderService.drawPrimitiveLine(this.width / 2, 0, this.width / 2, this.height, this.localGroup).style('stroke', '#7b00ff');

        this.text.draw(this.localGroup);

        // this.arrow.draw();

        this.drawPointingNodes();
        this.setupDragHandler();
    }

    private drawPointingNodes(): void {
        const trianglesPayload = this.mountTrianglePayloads();

        this.pointingNodes = {
            top: { ...trianglesPayload.top, element: this.renderService.drawPrimitiveTriangle(trianglesPayload.top, 'b').attr("stroke", this.context.COLORS.blue).attr("fill", this.context.COLORS.white).attr("display", "none") },
            right: { ...trianglesPayload.right, element: this.renderService.drawPrimitiveTriangle(trianglesPayload.right, 'l').attr("stroke", this.context.COLORS.blue).attr("fill", this.context.COLORS.white).attr("display", "none") },
            bottom: { ...trianglesPayload.bottom, element: this.renderService.drawPrimitiveTriangle(trianglesPayload.bottom, 't').attr("stroke", this.context.COLORS.blue).attr("fill", this.context.COLORS.white).attr("display", "none") },
            left: { ...trianglesPayload.left, element: this.renderService.drawPrimitiveTriangle(trianglesPayload.left, 'r').attr("stroke", this.context.COLORS.blue).attr("fill", this.context.COLORS.white).attr("display", "none") },
        };
    }

    private flipPointingNodes(flip: boolean): void {
        let offset = this.POINTING_NODES_SIZE;
        const updatedTrianglePayloads = this.mountTrianglePayloads();
        
        if (flip) {
            updatedTrianglePayloads.top.y -= offset;
            updatedTrianglePayloads.right.x += offset;
            updatedTrianglePayloads.bottom.y += offset;
            updatedTrianglePayloads.left.x -= offset;

            this.renderService.rotatePathElement(updatedTrianglePayloads.top, 0).attr("fill", this.context.COLORS.blue);
            this.renderService.rotatePathElement(updatedTrianglePayloads.right, 90).attr("fill", this.context.COLORS.blue);
            this.renderService.rotatePathElement(updatedTrianglePayloads.bottom, 180).attr("fill", this.context.COLORS.blue);
            this.renderService.rotatePathElement(updatedTrianglePayloads.left, 270,).attr("fill", this.context.COLORS.blue);

            return;
        }

        this.renderService.rotatePathElement(updatedTrianglePayloads.top, 180).attr("fill", "transparent");
        this.renderService.rotatePathElement(updatedTrianglePayloads.right, 270).attr("fill", "transparent");
        this.renderService.rotatePathElement(updatedTrianglePayloads.bottom, 0).attr("fill", "transparent");
        this.renderService.rotatePathElement(updatedTrianglePayloads.left, 90).attr("fill", "transparent");
    }

    private transformPointingNodes(): void {
        let offset = this.POINTING_NODES_SIZE;
        const updatedTrianglePayloads = this.mountTrianglePayloads();

        if(this.isSelected) {
            updatedTrianglePayloads.top.y -= offset;
            updatedTrianglePayloads.right.x += offset;
            updatedTrianglePayloads.bottom.y += offset;
            updatedTrianglePayloads.left.x -= offset;
        }

        this.renderService.translateElement(updatedTrianglePayloads.top);
        this.renderService.translateElement(updatedTrianglePayloads.right);
        this.renderService.translateElement(updatedTrianglePayloads.bottom);
        this.renderService.translateElement(updatedTrianglePayloads.left);
    }

    private mountTrianglePayloads(): { top: PrimitiveElementPayload, right: PrimitiveElementPayload, bottom: PrimitiveElementPayload, left: PrimitiveElementPayload } {
        const nodesHalfSize = this.POINTING_NODES_SIZE / 2;

        return {
            top: {
                x: this.width / 2 - nodesHalfSize,
                y: 0,
                width: this.POINTING_NODES_SIZE,
                height: this.POINTING_NODES_SIZE,
                element: this.pointingNodes?.top.element,
                group: this.localGroup,
            },
            right: {
                x: this.width - this.POINTING_NODES_SIZE,
                y: this.height / 2 - nodesHalfSize,
                width: this.POINTING_NODES_SIZE,
                height: this.POINTING_NODES_SIZE,
                element: this.pointingNodes?.right.element,
                group: this.localGroup
            },
            bottom: {
                x: this.width / 2 - nodesHalfSize,
                y: this.height - this.POINTING_NODES_SIZE,
                width: this.POINTING_NODES_SIZE,
                height: this.POINTING_NODES_SIZE,
                element: this.pointingNodes?.bottom.element,
                group: this.localGroup
            },
            left: {
                x: 0,
                y: this.height / 2 - nodesHalfSize,
                width: this.POINTING_NODES_SIZE,
                height: this.POINTING_NODES_SIZE,
                element: this.pointingNodes?.left.element,
                group: this.localGroup
            },
        };
    }

    public remove() {
        this.line.remove();
        this.rect.remove();
    }

    public call(selection: D3DragGroupFunction): void {
        this.localGroup.call(selection);
    }

    public transform(x: number, y: number, width: number, height: number): void {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.localGroup.attr("transform", `translate(${this.x}, ${this.y})`);

        this.rect.attr('width', this.width)
            .attr('height', this.height);

        this.line.attr('x2', this.width)
            .attr('y1', this.height - (this.height - 20))
            .attr('y2', this.height - (this.height - 20));

        this.text.transform(x, y, width, height);

        this.transformPointingNodes();
    }

    public getPositionAndSize(): EntityBase {
        return new EntityBase(this.id, this.x, this.y, this.width, this.height);
    }

    public highlightBorders(highlight: boolean): void {
        // Default
        let color = '#3d3d3dff';
        let lineSize = 1;

        if (highlight) {
            color = this.context.COLORS.blue;
            lineSize = 1;
        }

        this.rect.attr('stroke-width', lineSize.toString())
            .attr('stroke', color);

        this.line.style("stroke-width", 1)
            .style("stroke", color);
    }

    private setupDragHandler(): void {
        const dragHandler = d3.drag<SVGGElement, unknown, void>()
            .filter(() => {
                return true; // Allow all events
            })
            .on('start', (event: d3.D3DragEvent<SVGGElement, unknown, void>) => {
                this.dragStartPos = { x: event.x, y: event.y };

                this.emitClickDown(event);
            })
            .on('drag', (event: d3.D3DragEvent<SVGGElement, unknown, void>) => {

                const dx = Math.abs(event.x - this.dragStartPos.x);
                const dy = Math.abs(event.y - this.dragStartPos.y);

                if (!this.context.__appState.keyboard.shiftPressed) {
                    // Wait 5 pixels before start drag.
                    if (!this.isDragging && (dx > 5 || dy > 5)) {
                        this.isDragging = true;
                        this.emitStartMove(new EventPayload(event, this));
                    }

                    if (this.isDragging) {
                        this.emitMoving(new EventPayload(event, this));
                    }
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

        this.localGroup
            .style('cursor', 'grab')
            .call(dragHandler);
    }

    protected setSelected(selected: boolean): void {
        this.highlightBorders(selected);
        this.flipPointingNodes(selected);

        if (!selected) this.onLeavePointingMode();
    }

    public translate(x: number, y: number): void {
        this.localGroup.attr("transform", `translate(${x}, ${y})`);
        this.text.translate(x, y);
    }
}
