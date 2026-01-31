
type PrimitiveElement = D3PathElementSelection;

export default interface PrimitiveElementPayload {
    x: number;
    y: number;
    width: number;
    height: number;
    element?: PrimitiveElement;
    group?: D3GElementSelection;
}