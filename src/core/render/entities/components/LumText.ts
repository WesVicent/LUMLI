// import RenderService from "../engines/d3/RenderService";
// import Entity from "./EntityBase";

// export default class LumText extends Entity {
//     protected draw(): void {
//         console.log("Method not implemented.");
//     }
//     private textElement: D3TextElement;
//     private x: number;
//     private y: number;
//     private text: string;
    
//     private charPerLine: number;

//     private containerWidth = 0;
//     private containerHeight = 0;

//     public constructor(x: number, y: number, areaWidth: number, areaHeight: number, fontSize: number, text: string, renderService: RenderService, group?: D3GElement) {
//         super();

//         /* 
//             An area width of 350 fits 18 chars with size of 35.

//             AreaHorizontal (A): 350
//             CharPerLine (N): 18
//             CharSize (S): 35
            
//             Scaling constant (k): A / (N * S) = 5 / 9

//             N = A / ((5 / 9) * S)
//         */
//         this.charPerLine = Math.floor(areaWidth / Math.floor(areaWidth / (areaWidth / ((5 / 9) * fontSize))));

//         this.x = x;
//         this.y = y;
//         this.text = text;
//         this.containerWidth = areaWidth;
//         this.containerHeight = areaHeight;
//         this.textElement = renderService.drawPrimitiveText(x, y, fontSize, text.slice(0, this.charPerLine), group);


//         if(text.length > this.charPerLine) {
//             this.breakLine(text.slice(18, text.length));
//         }
//     }

//     private breakLine(text: string) {
//         if(text.length > this.charPerLine) {
//             this.append(text.slice(0 ,this.charPerLine));
//             this.breakLine(text.slice(this.charPerLine, text.length));
//             return;
//         }

//         this.append(text);
//     }

//     public remove() {
//         this.textElement.remove();
//     }

//     public append(text: string): D3TextSpanElement {
//         return this.textElement.append('tspan')
//             .attr('x', this.x)
//             .attr('dy', '1em')
//             .text(text);
//     }
// }