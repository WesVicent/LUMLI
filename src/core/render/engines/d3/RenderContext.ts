export default class RenderContext {
    private svg: D3SVGElementSelection;
    public readonly width: number;
    public readonly height: number;

    public readonly hCenter: number
    public readonly vCenter: number

    constructor(svg: D3SVGElementSelection, width: number, height: number) {
        this.svg = svg;
        this.width = width;
        this.height = height;
        this.hCenter = width / 2;
        this.vCenter = height / 2;
    }

    public append<T extends D3BaseType>(name: string): D3Selection<T> {
        return this.svg.append(name) as D3Selection<T>;
    }

    public getCore(): D3SVGElementSelection {
        return this.svg;
    }
}