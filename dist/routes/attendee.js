"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const mongodb_1 = require("mongodb");
const schemas_1 = require("../models/schemas");
const AttendeeRoute = express_1.default.Router();
AttendeeRoute.use((req, res, next) => {
    if (req.method.toLowerCase() !== "get" && req.headers["content-type"] !== "application/json") {
        res.status(500).send(`content-type must be of 'application/json' not '${req.headers["content-type"]}'`);
        res.end();
    }
    next();
});
const AttendeeTable = (database) => database.collection("attendee");
AttendeeRoute.route("/")
    .get((req, res) => {
    (0, db_1.db_run)((database) => __awaiter(void 0, void 0, void 0, function* () {
        const attendiesArrray = yield AttendeeTable(database).find({}).toArray();
        if (attendiesArrray.length > 0) {
            res.status(200).json(attendiesArrray);
        }
        else {
            res.status(404).send("no attendees available");
        }
    }));
})
    .post((req, res) => {
    const attendee = req.body, { error } = schemas_1.AttendeeSchema.validate(attendee);
    if (error) {
        res.status(400).send(error.details[0].message);
    }
    else {
        (0, db_1.db_run)((database) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield AttendeeTable(database).insertOne(attendee);
            if (result.insertedId) {
                res.status(201).send("User registered successfully");
            }
            else {
                res.status(400).send("Failed to register user");
            }
        }));
    }
});
AttendeeRoute.route("/:id")
    .get((req, res) => {
    const attendeeID = req.params.id;
    (0, db_1.db_run)((database) => __awaiter(void 0, void 0, void 0, function* () {
        const foundAttendant = yield AttendeeTable(database).findOne({ _id: new mongodb_1.ObjectId(attendeeID) });
        if (foundAttendant == null) {
            res.status(404).send("user cannot be found");
        }
        else {
            res.status(200).json(foundAttendant);
        }
    }));
})
    .put((req, res) => {
    const attendeeID = req.params.id, attendeeBody = req.body, { error } = schemas_1.AttendeeSchema.validate(attendeeBody);
    if (error) {
        res.status(400).send(error.details[0].message);
    }
    else {
        (0, db_1.db_run)((database) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield AttendeeTable(database).updateOne({ _id: new mongodb_1.ObjectId(attendeeID) }, { $set: attendeeBody });
            if (result.matchedCount === 1) {
                res.status(200).json(attendeeBody);
            }
            else {
                res.status(404).send("Failed to update, cause user cannot be found");
            }
        }));
    }
})
    .delete((req, res) => {
    const attendeeID = req.params.id;
    (0, db_1.db_run)((database) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield AttendeeTable(database).deleteOne({ _id: new mongodb_1.ObjectId(attendeeID) });
        if (result.deletedCount == 1) {
            res.status(200).send("user deleted successfully");
        }
        else {
            res.status(400).send("Failed to delete user, user has already been deleted");
        }
    }));
});
exports.default = AttendeeRoute;
