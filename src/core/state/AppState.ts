import Entity from "../render/entities/Entity";

export default class AppState {
    public keyboard = {
        ctrlPressed: false,
        shiftPressed: false,
        altPressed: false,
    };

    public selectedEntities: Entity[] = [];
}