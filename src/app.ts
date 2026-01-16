import * as d3 from 'd3';
import RenderService from './core/render/engines/d3/RenderService'
import RenderContext from './core/render/engines/d3/RenderContext';
import { EventBus } from './core/render/EventBus';
import LumCard from './core/render/entities/LumCard';
import ResizingController from './core/render/controllers/ResizingController';
import MovingController from './core/render/controllers/MovingController';
import ResizeNode from './core/render/entities/working-bench/ResizeNode';
import KeyboardController from './core/render/controllers/KeyboardController';
import SelectionController from './core/render/controllers/SelectionController';

class Lum {
    public static init() {
        const SVG_ID = 'diagram';
        const svg: D3SVGElementSelection = d3.select(`#${SVG_ID}`);
        const element = document.getElementById(SVG_ID);

        const contextWidth = element?.clientWidth || 100;
        const contextHeight = element?.clientHeight || 100;

        const eventBus = new EventBus();
        const renderContext = new RenderContext(svg, contextWidth, contextHeight);
        const renderService: RenderService = new RenderService(renderContext);

        const WIDHT = 200;
        const HEIGHT = WIDHT / 2;

        const X_POS = renderContext.hCenter - WIDHT / 2;
        const Y_POS = renderContext.vCenter - HEIGHT / 2;

        const keyboardController = new KeyboardController(eventBus);

        new MovingController(eventBus);
        new ResizingController(eventBus);
        new SelectionController(eventBus, keyboardController);

        const entities = [
            new LumCard('card-1', X_POS - WIDHT, Y_POS - HEIGHT, WIDHT, HEIGHT, renderService, eventBus),
            new LumCard('card-2', X_POS + WIDHT, Y_POS + HEIGHT, WIDHT, HEIGHT, renderService, eventBus),
            new LumCard('card-3', X_POS, Y_POS, WIDHT, HEIGHT, renderService, eventBus),

            new ResizeNode('resizing-nodes', X_POS, Y_POS, WIDHT, HEIGHT, renderService, eventBus),
        ];

        entities.forEach(entity => {
            entity.draw();
        });
    }
}

// When the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Lum.init();
});