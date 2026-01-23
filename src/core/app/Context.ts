import Entity from "../render/entities/Entity";
import AppState from "../state/AppState";

export default class Context {
    private appState: AppState;

    constructor(appState: AppState) {
        this.appState = appState;
    }

    public selected(): Entity[] {
        return this.appState.selectedEntities
    }
}