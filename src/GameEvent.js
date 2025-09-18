class Event {
    constructor(text, options=[]) {
        this._text = text;
        this._options = options;
    }

    get text() {
        return this._text
    }

    get options() {
        return this._options
    }
}

class AIDetectionEvent extends Event {
    constructor(text, options=[], truePosRate, falsePosRate) {
        super(text, options);
        this._truePosRate = truePosRate;
        this._falsePosRate = falsePosRate;
    }

    get truePosRate() {
        return this._truePosRate;
    }

    get falsePosRate() {
        return this._falsePosRate;
    }
}

class EventOption {
    constructor(id, text, energy) {
        this._id = id;
        this._text = text;
        this._energy = energy;    }

    get id() {
        return this._id;
    }

    get text() {
        return this._text;
    }

    get energy() {
        return this._energy;
    }
}

export const GameEvent = {
    NONE: new Event("u r bing chilling"),
    SUSPECT_AI: new AIDetectionEvent("You think one of your students is using AI.", [new EventOption(0, "Do nothing", 0), new EventOption(1, "Report them for cheating", 1)], 0.8, 0.3),
}