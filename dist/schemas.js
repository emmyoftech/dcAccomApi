"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccomodationSchema = exports.GroupSchema = exports.FamilySchema = exports.AttendeeSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.AttendeeSchema = joi_1.default.object({
    _id: joi_1.default.number().required(),
    firstname: joi_1.default.string().min(3).required(),
    lastname: joi_1.default.string().min(3).required(),
    email: joi_1.default.string().regex(/.*@.*/).required(),
    phone: joi_1.default.string().length(11).required(),
    category: joi_1.default.string().required(),
    groupID: joi_1.default.number().required()
});
exports.FamilySchema = joi_1.default.object({
    _id: joi_1.default.number().required(),
    attendeeID: joi_1.default.number().required(),
    spouseName: joi_1.default.string().required(),
    numChildren: joi_1.default.number().required()
});
exports.GroupSchema = joi_1.default.object({
    _id: joi_1.default.number().required(),
    groupName: joi_1.default.string().required(),
    groupLeaderName: joi_1.default.string().required(),
    groupLeaderContact: joi_1.default.string().length(11).required()
});
exports.AccomodationSchema = joi_1.default.object({
    _id: joi_1.default.number().required(),
    attendeeID: joi_1.default.number().required(),
    AccommodationType: joi_1.default.string().required()
});
