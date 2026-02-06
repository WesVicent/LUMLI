import Context from '../../../app/Context';
import { Event } from '../../../event/EventNames';
import RenderService from '../../engines/d3/RenderService';
import Entity from '../Entity';
import PrimitiveElementPayload from '../interfaces/PrimitiveElementPayload';
export default class PointingNodes extends Entity {
    public wasDrawn = false;

    private readonly POINTING_NODES_SIZE = 8;

    private localGroup!: D3GElementSelection;
    private pointingNodes!: { top: PrimitiveElementPayload, right: PrimitiveElementPayload, bottom: PrimitiveElementPayload, left: PrimitiveElementPayload };

    constructor(context: Context, id: string, x: number, y: number, width: number, height: number, renderService: RenderService) {
        super(context, `p-node-${id}`, x, y, width, height, renderService);

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

    public draw(group?: D3GElementSelection): void {
        this.localGroup = group || this.localGroup;


        const trianglesPayload = this.mountTrianglePayloads();

        this.pointingNodes = {
            top: {
                ...trianglesPayload.top, element: this.renderService.drawPrimitiveTriangle(trianglesPayload.top)
                    .attr('id', this.id)
                    .attr('class', 'top')
                    .attr('stroke', this.context.COLORS.blue)
                    .attr('fill', this.context.COLORS.white)
                    .attr('display', 'none')
                    .style('cursor', 'crosshair')
            },
            right: {
                ...trianglesPayload.right, element: this.renderService.drawPrimitiveTriangle(trianglesPayload.right)
                    .attr('id', this.id)
                    .attr('class', 'right')
                    .attr('stroke', this.context.COLORS.blue)
                    .attr('fill', this.context.COLORS.white)
                    .attr('display', 'none')
                    .style('cursor', 'crosshair')
            },
            bottom: {
                ...trianglesPayload.bottom, element: this.renderService.drawPrimitiveTriangle(trianglesPayload.bottom)
                    .attr('id', this.id)
                    .attr('class', 'bottom')
                    .attr('stroke', this.context.COLORS.blue)
                    .attr('fill', this.context.COLORS.white)
                    .attr('display', 'none')
                    .style('cursor', 'crosshair')
            },
            left: {
                ...trianglesPayload.left, element: this.renderService.drawPrimitiveTriangle(trianglesPayload.left)
                    .attr('id', this.id)
                    .attr('class', 'left')
                    .attr('stroke', this.context.COLORS.blue)
                    .attr('fill', this.context.COLORS.white)
                    .attr('display', 'none')
                    .style('cursor', 'crosshair')
            },
        };

        this.wasDrawn = true;
    }

    public appendTo(group: D3GElementSelection) {
        Object.values(this.pointingNodes).forEach(node => {
            node.element?.remove();
            group.append(() => { return node.element!.node(); });
        });
    }

    public transform(x: number, y: number, width: number, height: number): void {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        const offset = this.POINTING_NODES_SIZE;
        const updatedTrianglePayloads = this.mountTrianglePayloads();

        updatedTrianglePayloads.top.y -= offset;
        updatedTrianglePayloads.right.x += offset;
        updatedTrianglePayloads.bottom.y += offset;
        updatedTrianglePayloads.left.x -= offset;

        // Position to group boundaries and point to outside.
        this.renderService.rotatePathElement(updatedTrianglePayloads.top, 0).attr('fill', this.context.COLORS.blue);
        this.renderService.rotatePathElement(updatedTrianglePayloads.right, 90).attr('fill', this.context.COLORS.blue);
        this.renderService.rotatePathElement(updatedTrianglePayloads.bottom, 180).attr('fill', this.context.COLORS.blue);
        this.renderService.rotatePathElement(updatedTrianglePayloads.left, 270,).attr('fill', this.context.COLORS.blue);
    }

    public setSelected(): void { }
    public translate(): void { }
}