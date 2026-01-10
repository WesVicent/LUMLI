// Flatten up types.
type D3BaseTypeSelection = d3.Selection<BaseType, unknown, HTMLElement, any>;
type D3BaseTypeSVGSelection = d3.Selection<BaseType, unknown, SVGSVGElement, unknown>;

type D3SVGElement = d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
type D3GElement = d3.Selection<SVGGElement, unknown, HTMLElement, any>;
type D3RectElement = d3.Selection<SVGRectElement, unknown, HTMLElement, any>;
type D3LineElement = d3.Selection<SVGLineElement, unknown, HTMLElement, any>;
type D3TextElement = d3.Selection<SVGTextElement, unknown, HTMLElement, any>;
type D3TextSpanElement = d3.Selection<SVGTSpanElement, unknown, HTMLElement, any>;

type D3DragGroupEvent =  d3.D3DragEvent<SVGGElement, unknown, void>
type D3DragRectEvent = d3.D3DragEvent<SVGRectElement, unknown, void>;

type D3DragRectBehavior = d3.DragBehavior<SVGRectElement, unknown, void>;
type D3DragRectFunction = (selection: D3RectElement) => void;

type D3DragGroupFunction = (selection: D3GElement) => void;                   