"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.info = function (message, meta) {
        var timestamp = new Date().toISOString();
        console.log("[".concat(timestamp, "] INFO: ").concat(message), meta || "");
    };
    Logger.error = function (message, error, meta) {
        var timestamp = new Date().toISOString();
        console.error("[".concat(timestamp, "] ERROR: ").concat(message), error || "", meta || "");
    };
    Logger.warn = function (message, meta) {
        var timestamp = new Date().toISOString();
        console.warn("[".concat(timestamp, "] WARN: ").concat(message), meta || "");
    };
    Logger.debug = function (message, meta) {
        if (process.env.NODE_ENV === "development") {
            var timestamp = new Date().toISOString();
            console.log("[".concat(timestamp, "] DEBUG: ").concat(message), meta || "");
        }
    };
    return Logger;
}());
exports.Logger = Logger;
