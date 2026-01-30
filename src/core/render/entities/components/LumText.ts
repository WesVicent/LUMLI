import Context from "../../../app/Context";
import RenderService from "../../engines/d3/RenderService";
import Entity from "../Entity";

export default class LumText extends Entity {
    private localGroup!: D3GElementSelection;
    private fontSize: number;

    private textElement!: D3TextElementSelection;
    private text: string;

    private charPerLine!: number;

    public constructor(context: Context, x: number, y: number, areaWidth: number, areaHeight: number, fontSize: number, text: string, renderService: RenderService) {
        super(context, '', x, y, areaWidth, areaHeight, renderService);

        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.text = text;
    }

    private breakIntoMultipleLines(text: string) {
        if (text.length > this.charPerLine) {
            this.append(text.slice(0, this.charPerLine));
            this.breakIntoMultipleLines(text.slice(this.charPerLine, text.length));
            
            return;
        }

        this.append(text);       
    }

    public remove() {
        this.textElement.remove();
    }

    public append(text: string): D3TextSpanElementSelection {
        return this.textElement.append('tspan')
            .attr('x', 0)
            .attr('dy', '1em')
            .text(text);
    }

    translate(x: number, y: number): void {
        
        this.localGroup.attr("transform", `translate(${x}, ${y})`);
    }

    public transform(x: number, y: number, width: number, height: number): void {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.remove();
        this.draw();
    }

    public draw(localGroup?: D3GElementSelection): void {
        this.localGroup = localGroup || this.localGroup;

        /*
            An area width of 350 fits 18 chars with size of 35.

            AreaHorizontal (A): 350
            CharPerLine (N): 18
            CharSize (S): 35
            
            Scaling constant (k): A / (N * S) = 5 / 9

            N = A / ((5 / 9) * S)
        */

        this.charPerLine = Math.floor(this.width / Math.floor(this.width / (this.width / ((5 / 9) * this.fontSize))));
        this.textElement = this.renderService.drawPrimitiveText(0, 0, this.fontSize, this.text.slice(0, this.charPerLine), this.localGroup);

        if (this.text.length > this.charPerLine) {
            this.breakIntoMultipleLines(this.text.slice(this.charPerLine, this.text.length));
        }
    }

    protected setSelected(): void { }
}