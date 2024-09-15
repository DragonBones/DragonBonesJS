"use strict";
var parseDDS = require("./parseDDS.js"), parseKTX = require("./parseKTX.js");
exports.parseDDS = parseDDS.parseDDS;
exports.FORMATS_TO_COMPONENTS = parseKTX.FORMATS_TO_COMPONENTS;
exports.TYPES_TO_BYTES_PER_COMPONENT = parseKTX.TYPES_TO_BYTES_PER_COMPONENT;
exports.TYPES_TO_BYTES_PER_PIXEL = parseKTX.TYPES_TO_BYTES_PER_PIXEL;
exports.parseKTX = parseKTX.parseKTX;
//# sourceMappingURL=index.js.map
