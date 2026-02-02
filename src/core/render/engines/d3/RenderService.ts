import * as d3 from "d3";
import RenderContext from "./RenderContext";
import PrimitiveElementPayload from "../../entities/interfaces/PrimitiveElementPayload";

export default class RenderService {
    public readonly context: RenderContext;

    public constructor(context: RenderContext) {
        this.context = context;
    }

    /////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////  PRIMITIVES  ///////////////////////////////      
    public createPrimitiveGroup(id: string, x: number, y: number, width: number, height: number): D3GElementSelection {
        return this.context.append<SVGGElement>('g')
            .attr("transform", `translate(${x}, ${y})`)
            .attr('width', width)       // Maybe doesn't matter
            .attr('height', height)    // Maybe doesn't matter
            .attr("id", id);

    }

    public drawPrimitiveRect(x: number, y: number, width: number, height: number, group?: D3GElementSelection): D3RectElementSelection {
        const node = group ?? this.context.getCore();

        const rect = node
            .append('rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', width)
            .attr('height', height)
            .attr('fill', '#ffffff')
            .attr('stroke', '#3d3d3dff')
            .attr('stroke-width', 1);

        return rect;
    }

    public drawPrimitiveLine(startX: number, startY: number, endX: number, endY: number, group?: D3GElementSelection): D3LineElementSelection {
        const node = group ?? this.context.getCore();

        const line = node.append('line')
            .attr('x1', startX)
            .attr('y1', startY)
            .attr('x2', endX)
            .attr('y2', endY)
            .style("stroke", "#3d3d3dff")
            .style("stroke-width", 1);

        return line;
    }

    public drawPrimitiveText(x: number, y: number, fontSize: number, text: string, group?: D3GElementSelection): D3TextElementSelection {
        const node = group ?? this.context.getCore();

        const textElement = node.append('text')
            .attr('x', 0)
            .attr('y', y)
            .attr('text-anchor', 'start')
            .attr('dominant-baseline', 'hanging')
            .attr('fill', '#3d3d3dff')
            .attr('font-family', 'sans-serif')
            .attr('font-size', fontSize);

        textElement.append('tspan')
            .attr('x', x)
            .attr('dy', '0.15em')
            .text(text);

        return textElement;
    }

    public translateElement(elementPayload: PrimitiveElementPayload): D3PathElementSelection {
        const { x, y, element } = elementPayload;

        const transformationString = element?.attr('transform') || '' as string;
        const baseTransform = transformationString.replace(/translate\([^\)]+\)/g, "").trim();
        const finalTransform = `translate(${x}, ${y}) ${baseTransform}`.trim();

        return element!.attr('transform', finalTransform);
    }

    public rotatePathElement(elementPayload: PrimitiveElementPayload, rotation: number, addTransform = ''): D3PathElementSelection {
        let { width, height, element } = elementPayload;

        this.translateElement(elementPayload);

        const centerX = width / 2;
        const centerY = height / 2;

        const currentTransform = element?.attr('transform') || '';
        const transformWithoutRotation = currentTransform.replace(/rotate\([^)]+\)/g, '').trim();

        let newTransform = transformWithoutRotation;

        if (addTransform) {
            newTransform += ` ${addTransform}`;
        }

        newTransform += ` rotate(${rotation}, ${centerX}, ${centerY})`;

        return element!.attr('transform', newTransform.trim());
    }

    public drawPrimitiveTriangle(options: PrimitiveElementPayload, pointingTo: string): D3PathElementSelection {
        const { x, y, width, height, group } = options;

        const trianglePath = this.drawPrimitivePath([
            { x: width / 2, y: 0 },
            { x: 0, y: height },
            { x: width, y: height }
        ], group);

        let rotation = 0;

        switch (pointingTo) {
            case 't': rotation = 0; break;
            case 'r': rotation = 90; break;
            case 'b': rotation = 180; break;
            case 'l': rotation = 270; break;
            default:
                trianglePath.attr('fill', 'red');
                rotation = 0;
                break;
        }

        this.rotatePathElement({ x, y, width, height, element: trianglePath }, rotation)

        return trianglePath;
    }


    public drawPrimitivePath(points: { x: number, y: number }[], group?: D3GElementSelection, color = '#6d6d6d'): D3PathElementSelection {
        const node = group ?? this.context.getCore();

        const pathData = points.reduce((acc, { x, y }, i) => {
            const command = i === 0 ? 'M' : 'L';
            return `${acc} ${command} ${x} ${y}`;
        }, '') + ' Z';

        const path = node.append('path')
            .attr("d", pathData)
            .attr('fill', 'white')
            .attr('stroke', color)
            .attr('stroke-width', 2)
            .style('stroke-linejoin', 'round');

        return path;
    }
    /////////////////////////////////////////////////////////////////////////////////////

    public select<T extends D3BaseType = D3BaseType>(selector: string): D3Selection<T, unknown, HTMLElement, any> {
        return this.context.getCore().select(selector) as D3Selection<T, unknown, HTMLElement, any>;
    }

    public selectAll<T extends D3BaseType = D3BaseType>(selection: string): D3Selection<T, unknown, SVGSVGElement, any> {
        return this.context.getCore().selectAll(selection) as D3Selection<T, unknown, SVGSVGElement, any>;
    }
}