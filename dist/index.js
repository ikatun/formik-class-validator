"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var class_transformer_validator_1 = require("class-transformer-validator");
var lodash_1 = require("lodash");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
__export(require("class-validator"));
exports.ValidateNested = function (typeFunction, options) {
    return function (target, key) {
        class_validator_1.ValidateNested(options)(target, key);
        class_transformer_1.Type(typeFunction)(target, key);
    };
};
function convertErrorToFormikFormat(errors) {
    var result = {};
    for (var _i = 0, _a = Array.from(errors); _i < _a.length; _i++) {
        var error = _a[_i];
        result[error.property] = lodash_1.values(error.constraints)[0];
        if (lodash_1.size(error.children) > 0) {
            result[error.property] = convertErrorToFormikFormat(error.children);
        }
    }
    return result;
}
exports.formikValidate = function (modelClass, data) {
    try {
        class_transformer_validator_1.transformAndValidateSync(modelClass, data);
        return {};
    }
    catch (e) {
        return convertErrorToFormikFormat(e);
    }
};
var FormikValidatorBase = /** @class */ (function () {
    function FormikValidatorBase() {
    }
    FormikValidatorBase.createValidator = function () {
        var _this = this;
        return function (data) { return exports.formikValidate(_this, data); };
    };
    return FormikValidatorBase;
}());
exports.FormikValidatorBase = FormikValidatorBase;
function ValidateWith(validate, validationOptions) {
    return function (object, propertyName) {
        class_validator_1.registerDecorator({
            name: "isLongerThan",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate: function (value, args) {
                    return validate(args);
                }
            }
        });
    };
}
exports.ValidateWith = ValidateWith;
