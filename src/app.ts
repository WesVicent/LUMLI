import * as d3 from 'd3';
import RenderService from './core/render/engines/d3/RenderService'
import RenderContext from './core/render/engines/d3/RenderContext';
import LumCard from './core/render/entities/components/LumCard';
import ResizingStateController from './core/render/behaviors/ResizingStateController';
import MovingStateController from './core/render/behaviors/MovingStateController';
import BoundaryBox from './core/render/entities/GUI/BoundaryBox';
import SelectionStateController from './core/render/behaviors/SelectionStateController';
import KeyboardStateController from './core/input/KeyboardStateController';
import { EventBus } from './core/event/EventBus';
import AppState from './core/state/AppState';
import Context from './core/app/Context';
import MouseStateController from './core/input/MouseStateController';

class Lum {
    public static init() {
        const SVG_ID = 'diagram';
        const svg: D3SVGElementSelection = d3.select(`#${SVG_ID}`);
        const element = document.getElementById(SVG_ID);

        const contextWidth = element?.clientWidth || 100;
        const contextHeight = element?.clientHeight || 100;

        const appState = new AppState();
        const appContext = new Context(appState);
        const eventBus = new EventBus();

        const renderContext = new RenderContext(svg, contextWidth, contextHeight);
        const renderService: RenderService = new RenderService(renderContext);

        const WIDHT = 200;
        const HEIGHT = WIDHT / 2;

        const X_POS = renderContext.hCenter - WIDHT / 2;
        const Y_POS = renderContext.vCenter - HEIGHT / 2;

        // INPUT
        new KeyboardStateController(eventBus, appState);
        new MouseStateController(eventBus, appState);

        // BEHAVIOR
        new MovingStateController(eventBus, appState);
        new ResizingStateController(eventBus, appState);
        new SelectionStateController(eventBus, appState);

        const entities = [
            new LumCard(appContext, 'card-1', X_POS - WIDHT, Y_POS - HEIGHT, WIDHT, HEIGHT, renderService, eventBus),
            new LumCard(appContext, 'card-2', X_POS, Y_POS, WIDHT, HEIGHT, renderService, eventBus),
            new LumCard(appContext, 'card-3', X_POS + WIDHT, Y_POS + HEIGHT, WIDHT, HEIGHT, renderService, eventBus),

            new BoundaryBox(appContext, 'b-box', 0, 0, 0, 0, renderService, eventBus),
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