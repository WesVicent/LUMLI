import BoundaryBoxInitialState from "../render/behaviors/interfaces/BoundaryBoxInitialState";
import EntityInitialState from "../render/behaviors/interfaces/EntityInitialState";
import Entity from "../render/entities/Entity";

export default class AppState {
    public keyboard = {
        ctrlPressed: false,
        shiftPressed: false,
        altPressed: false,
    };

    public selectedEntities: Entity[] = [];

    public initialEntityStates: Map<string, EntityInitialState> = new Map();
    public initialBoundaryBox: BoundaryBoxInitialState | null = null;
}