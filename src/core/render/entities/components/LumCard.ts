import * as d3 from "d3";
import RenderService from "../../engines/d3/RenderService";
import EntityBase from "../types/EntityBase";
import Entity from "../Entity";
import EventPayload from "../../../event/types/EventPayload";
import Context from "../../../app/Context";
import LumText from "./LumText";
// import LumArrow from "./LumArrow";
import { Event } from "../../../event/EventNames";

export default class LumCard extends Entity {
    public localGroup!: D3GElementSelection;

    private rect!: D3RectElementSelection;
    private line!: D3LineElementSelection;
    private text: LumText;
    // private arrow!: LumArrow;

    private dragStartPos!: { x: number, y: number };
    private isDragging = false;

    // Resizing
    private readonly MIN_WIDTH = 40;
    private readonly MIN_HEIGHT = 40;

    constructor(context: Context, id: string, x: number, y: number, width: number, height: number, text: string, renderService: RenderService) {
        super(context, id, x, y, width, height, renderService);

        this.context.__eventBus.listen(Event.selection.SELECT, this.onSelected.bind(this));
        this.context.__eventBus.listen(Event.selection.UNSELECT, this.onUnselected.bind(this));
        this.context.__eventBus.listen(Event.selection.CLEAR, this.onSelectionClear.bind(this));

        width = width < this.MIN_WIDTH ? this.MIN_WIDTH : width;
        height = height < this.MIN_HEIGHT ? this.MIN_HEIGHT : height;

        this.width = width;
        this.height = height;

        this.text = new LumText(this.context, this.x, this.y, this.width, this.height, 18, text, this.renderService);

        // this.arrow = new LumArrow(this.context, 'asasasas', 100, 100, 200, 200, this.renderService);
    }

    public draw(): void {
        this.localGroup = this.renderService.createPrimitiveGroup(this.id, this.x, this.y, this.width, this.height);

        this.rect = this.renderService.drawPrimitiveRect(0, 0, this.width, this.height, this.localGroup);

        this.line = this.renderService.drawPrimitiveLine(0, this.height / 5, this.width, this.height / 5, this.localGroup);

        this.text.draw(this.localGroup);

        // this.arrow.draw();

        // GRID ref
        // this.renderService.drawPrimitiveLine(0, this.height / 2, this.width, this.height / 2, this.localGroup).style('stroke', '#7b00ff');
        // this.renderService.drawPrimitiveLine(this.width / 2, 0, this.width / 2, this.height, this.localGroup).style('stroke', '#7b00ff');

        this.setupDragHandler();
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

    public setSelected(selected: boolean): void {
        this.highlightBorders(selected);
    }

    public translate(x: number, y: number): void {
        this.localGroup.attr("transform", `translate(${x}, ${y})`);
        this.text.translate(x, y);
    }
}
