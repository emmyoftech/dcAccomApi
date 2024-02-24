"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentDetailsSchema = exports.AccomodationSchema = exports.GroupSchema = exports.FamilySchema = exports.AttendeeSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.AttendeeSchema = joi_1.default.object({
    _id: joi_1.default.string().optional(),
    firstname: joi_1.default.string().min(3).required(),
    lastname: joi_1.default.string().min(3).required(),
    email: joi_1.default.string().regex(/.*@.*/).required(),
    phone: joi_1.default.string().length(11).required(),
    category: joi_1.default.string().required(),
    groupID: joi_1.default.string()
});
exports.FamilySchema = joi_1.default.object({
    _id: joi_1.default.string().optional(),
    attendeeName: joi_1.default.string().required(),
    spouseName: joi_1.default.string().required(),
    numChildren: joi_1.default.number().required()
});
exports.GroupSchema = joi_1.default.object({
    _id: joi_1.default.string().optional(),
    groupName: joi_1.default.string().required(),
    groupLeaderName: joi_1.default.string().required(),
    groupLeaderContact: joi_1.default.string().length(11).required()
});
exports.AccomodationSchema = joi_1.default.object({
    _id: joi_1.default.string().optional(),
    attendeeID: joi_1.default.string().required(),
    accommodationType: joi_1.default.string().required()
});
exports.PaymentDetailsSchema = joi_1.default.object({
    _id: joi_1.default.string().optional(),
    type: joi_1.default.required()
});
