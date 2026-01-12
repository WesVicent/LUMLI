// Flatten up types.
type D3BaseType = d3.BaseType;

type D3Selection<T extends D3BaseType = D3BaseType, D = unknown, P extends D3BaseType = HTMLElement, PD = any> = d3.Selection<T, D, P, PD>;

type D3BaseTypeSelection = D3Selection<D3BaseType, unknown, HTMLElement, any>;
type D3BaseTypeSVGSelection = D3Selection<D3BaseType, unknown, SVGSVGElement, unknown>;
type D3SVGElementSelection = D3Selection<SVGSVGElement, unknown, HTMLElement, any>;
type D3GElementSelection = D3Selection<SVGGElement, unknown, HTMLElement, any>;
type D3RectElementSelection = D3Selection<SVGRectElement, unknown, HTMLElement, any>;
type D3LineElementSelection = D3Selection<SVGLineElement, unknown, HTMLElement, any>;
type D3TextElementSelection = D3Selection<SVGTextElement, unknown, HTMLElement, any>;
type D3TextSpanElementSelection = D3Selection<SVGTSpanElement, unknown, HTMLElement, any>;

type D3DragGroupEvent =  d3.D3DragEvent<SVGGElement, unknown, void>
type D3DragRectEvent = d3.D3DragEvent<SVGRectElement, unknown, void>;

type D3DragRectBehavior = d3.DragBehavior<SVGRectElement, unknown, void>;
type D3DragRectFunction = (selection: D3RectElementSelection) => void;

type D3DragGroupFunction = (selection: D3GElementSelection) => void;                   