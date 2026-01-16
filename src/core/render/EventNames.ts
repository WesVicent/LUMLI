export default class Event {
    public static readonly entity = {
        START_MOVEMENT: 0,
        MOVING: 1,
        STOP_MOVEMENT: 2,
        FOCUS: 3,
        START_RESIZE: 4,
        RESIZING: 5,
        STOP_RESIZE: 6,
        CLICK: 7,
    };

    public static readonly selection = {
        SELECT: 110,
        UNSELECT: 111,
        CHANGED: 112,
        CLEAR: 113
    };


    public static readonly key = {
        CTRL_D: 770,
        CTRL_U: 771,
    };
}