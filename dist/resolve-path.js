"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
function resolvePath(path, args) {
    var resultingPath = path;
    for (var _i = 0, _a = lodash_1.keys(args); _i < _a.length; _i++) {
        var key = _a[_i];
        var value = args[key];
        resultingPath = resultingPath.replace(":" + key, value);
    }
    return resultingPath;
}
exports.resolvePath = resolvePath;
