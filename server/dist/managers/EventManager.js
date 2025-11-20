"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventManager = void 0;
var logger_1 = require("../utils/logger");
var EventManager = /** @class */ (function () {
    function EventManager(io) {
        this.events = new Map();
        this.io = io;
    }
    EventManager.prototype.initializeGameEvents = function (roles) {
        var _a;
        var therapistId = (_a = roles.get("therapist")) === null || _a === void 0 ? void 0 : _a.playerId;
        console.log(therapistId);
        if (therapistId) {
            this.events.set("visit-therapist", {
                id: this.generateEventId(),
                type: "message",
                from: null,
                to: therapistId,
                data: [],
                step: 0,
            });
        }
    };
    EventManager.prototype.activateEvent = function (eventKey, playerId) {
        console.log(this.events);
        var eventData = this.events.get(eventKey);
        console.log(eventData);
        if (!eventData) {
            return null;
        }
        eventData.from = playerId;
        return { eventKey: eventKey, eventData: eventData };
    };
    EventManager.prototype.createEvent = function (eventKey, type, from, to, data) {
        var event = {
            id: this.generateEventId(),
            type: type,
            from: from,
            to: to,
            data: data,
            step: 0,
        };
        this.events.set(eventKey, event);
        logger_1.Logger.info("Создан новый ивент", {
            id: event.id,
            type: event.type,
            from: event.from,
            to: event.to,
        });
        return event;
    };
    EventManager.prototype.generateEventId = function () {
        return this.events.size;
    };
    return EventManager;
}());
exports.EventManager = EventManager;
