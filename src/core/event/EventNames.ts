export class Event {
    public static readonly entity = {
        START_MOVEMENT: 0,
        MOVING: 1,
        STOP_MOVEMENT: 2,
        FOCUS: 3,
        START_RESIZE: 4,
        RESIZING: 5,
        STOP_RESIZE: 6,
        CLICK_UP: 7,
        CLICK_DOWN: 8,
        START_POINT: 9,
        STOP_POINT: 10,
    };

    public static readonly selection = {
        SELECT: 110,
        UNSELECT: 111,
        CHANGED: 112,
        CLEAR: 113
    };

    public static readonly global = {
        CONTAINER_CLICK: 220,
        ENTER_POINTING_MODE: 221,
        LEAVE_POINTING_MODE: 222,
    };
}