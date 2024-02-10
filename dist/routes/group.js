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
const mongodb_1 = require("mongodb");
const db_1 = require("../db");
const schemas_1 = require("../models/schemas");
const GroupRoute = express_1.default.Router();
GroupRoute.use((req, res, next) => {
    if (req.method.toLowerCase() !== "get" && req.headers["content-type"] !== "application/json") {
        res.status(500).send(`content-type must be of 'application/json' not '${req.headers["content-type"]}'`);
        res.end();
    }
    next();
});
const GroupTable = (database) => database.collection("group");
GroupRoute.route("/")
    .get((req, res) => {
    (0, db_1.db_run)((database) => __awaiter(void 0, void 0, void 0, function* () {
        const allGroup = yield GroupTable(database).find({}).toArray();
        if (allGroup.length > 0) {
            res.status(200).json(allGroup);
        }
        else {
            res.status(404).send("no Group available");
        }
    }));
})
    .post((req, res) => {
    const group = req.body, { error } = schemas_1.GroupSchema.validate(group);
    if (error) {
        res.status(400).send(error.details[0].message);
    }
    else {
        (0, db_1.db_run)((database) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield GroupTable(database).insertOne(group);
            if (result.insertedId) {
                res.status(201).send("Group registered successfully");
            }
            else {
                res.status(400).send("Failed to register group");
            }
        }));
    }
});
GroupRoute.route("/:id")
    .get((req, res) => {
    const groupID = req.params.id;
    (0, db_1.db_run)((database) => __awaiter(void 0, void 0, void 0, function* () {
        const foundGroup = yield GroupTable(database).findOne({ _id: new mongodb_1.ObjectId(groupID) });
        if (foundGroup == null) {
            res.status(404).send("group cannot be found");
        }
        else {
            res.status(200).json(foundGroup);
        }
    }));
})
    .put((req, res) => {
    const groupID = req.params.id, group = req.body, { error } = schemas_1.GroupSchema.validate(group);
    if (error) {
        res.status(400).send(error.details[0].message);
    }
    else {
        (0, db_1.db_run)((database) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield GroupTable(database).updateOne({ _id: new mongodb_1.ObjectId(groupID) }, { $set: group });
            if (result.matchedCount == 1) {
                res.status(200).json(group);
            }
            else {
                res.status(404).send("Failed to update, cause group cannot be found");
            }
        }));
    }
})
    .delete((req, res) => {
    const groupID = req.params.id;
    (0, db_1.db_run)((database) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield GroupTable(database).deleteOne({ _id: new mongodb_1.ObjectId(groupID) });
        if (result.deletedCount == 1) {
            res.status(200).send("group deleted successfully");
        }
        else {
            res.status(400).send("Failed to delete group, group has already been deleted");
        }
    }));
});
exports.default = GroupRoute;
