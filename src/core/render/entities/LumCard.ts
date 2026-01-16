import * as d3 from "d3";
import RenderService from "../engines/d3/RenderService";
// import LumText from "./LumText";
import PositionAndSize from "../interfaces/PositionAndSize";
import Entity from "./EntityBase";
import { EventBus } from "../EventBus";
import EntityEventPayload from "../interfaces/EventPayload";
import EventPayload from "../interfaces/EventPayload";
import Event from "../EventNames";

export default class LumCard extends Entity {
    public localGroup!: D3GElementSelection;

    private rect!: D3RectElementSelection;
    private line!: D3LineElementSelection;
    // private text: LumText;

    // Resizing
    private readonly MIN_WIDTH = 40;
    private readonly MIN_HEIGHT = 40;

    constructor(id: string, x: number, y: number, width: number, height: number, renderService: RenderService, eventBus: EventBus) {
        super(id, x, y, width, height, eventBus, renderService);

        width = width < this.MIN_WIDTH ? this.MIN_WIDTH : width;
        height = height < this.MIN_HEIGHT ? this.MIN_HEIGHT : height;

        this.width = width;
        this.height = height;

        eventBus.listen(Event.entity.RESIZING, this.onResize.bind(this));

        // this.text = text;
    }

    public draw(): void {
        this.localGroup = this.renderService.createPrimitiveGroup(this.id, this.x, this.y, this.width, this.height);
        // let stringText = '123456789-12345678';

        const rect = this.renderService.drawPrimitiveRect(0, 0, this.width, this.height, this.localGroup);
        const line = this.renderService.drawPrimitiveLine(0, 0 + this.height / 5, this.width, this.localGroup);
        // const text = renderService.drawText(0, 0, width, height, 18, `${stringText}${stringText}${stringText}${stringText}${stringText}`, this.localGroup);

        this.rect = rect;
        this.line = line;

        this.setupDragHandler();
    }

    public remove() {
        this.line.remove();
        this.rect.remove();
    }

    public call(selection: D3DragGroupFunction): void {
        this.localGroup.call(selection);
    }

    public onResize(eventPayload: EventPayload): void {    
        if (this.id === eventPayload.target!.id) {
            this.x = eventPayload.target!.x;
            this.y = eventPayload.target!.y;
            this.width = eventPayload.target!.width;
            this.height = eventPayload.target!.height;
    
            this.localGroup.attr("transform", `translate(${this.x}, ${this.y})`);

            this.rect.attr('width', this.width)
            .attr('height', this.height);

            this.line.attr('x2', this.width)
                .attr('y1', this.height - (this.height - 18))
                .attr('y2', this.height - (this.height - 18));
        }
    }

    public getPositionAndSize(): PositionAndSize {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
        }
    }

    public highlightBorders(highlight: boolean): void {
        // Default
        let color = '#3d3d3dff';
        let lineSize = 1;

        if (highlight) {
            color = '#096bc7ff';
            lineSize = 2;
        }

        this.rect.attr('stroke-width', lineSize.toString())
            .attr('stroke', color);

        this.line.style("stroke-width", 1)
            .style("stroke", color);
    }

    protected setSelectionVisuals(selected: boolean): void {
        // Default implementation - override in subclasses
        this.highlightBorders(selected);
    }

    private setupDragHandler(): void {
        const dragHandler = d3.drag<SVGGElement, unknown, void>()
            .on('start', (event: d3.D3DragEvent<SVGGElement, unknown, void>) => {
                this.emitClick(event);
                this.setSelectionVisuals(true);
                this.emitStartMove(new EntityEventPayload(event, this));
            })
            .on('drag', (event: d3.D3DragEvent<SVGGElement, unknown, void>) => {
                this.emitMoving(new EntityEventPayload(event, this));
            })
            .on('end', (event: d3.D3DragEvent<SVGGElement, unknown, void>) => {
                 if (this.isSelected) {
                    this.emitFocus(new EntityEventPayload(event, this));
                }
                
                this.setSelectionVisuals(false);
                this.emitStopMove(new EntityEventPayload(event, this));
            });
        
        this.localGroup
            .style('cursor', 'grab')
            .call(dragHandler);
    }
    
    protected setSelected(selected: boolean): void {
        this.highlightBorders(selected);
    }

    public translate(x: number, y: number): void {
        this.localGroup.attr("transform", `translate(${x}, ${y})`);
    }
}
