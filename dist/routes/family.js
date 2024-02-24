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
const FamilyRoute = express_1.default.Router();
FamilyRoute.use((req, res, next) => {
    if (req.method.toLowerCase() !== "get" && req.headers["content-type"] !== "application/json") {
        res.status(500).send(`content-type must be of 'application/json' not '${req.headers["content-type"]}'`);
        res.end();
    }
    next();
});
const FamilyTable = (database) => {
    return database.collection("family");
};
FamilyRoute.route("/")
    .get((req, res) => {
    (0, db_1.db_run)((database) => __awaiter(void 0, void 0, void 0, function* () {
        const allFamilies = yield FamilyTable(database).find({}).toArray();
        if (allFamilies.length > 0) {
            res.status(200).json(allFamilies);
        }
        else {
            res.status(404).send("no families avaiilable");
        }
    }));
})
    .post((req, res) => {
    const family = req.body, { error } = schemas_1.FamilySchema.validate(family);
    if (error) {
        res.status(400).send(error.details[0].message);
    }
    else {
        (0, db_1.db_run)((database) => __awaiter(void 0, void 0, void 0, function* () {
            const { insertedId } = yield FamilyTable(database).insertOne(family);
            if (insertedId) {
                res.status(201).send("family was registered successfully");
            }
            else {
                res.status(400).send("failed to register family");
            }
        }));
    }
});
FamilyRoute.route("/:id")
    .get((req, res) => {
    const familyID = req.params.id;
    (0, db_1.db_run)((database) => __awaiter(void 0, void 0, void 0, function* () {
        const foundFamily = yield FamilyTable(database).find({ _id: new mongodb_1.ObjectId(familyID) }).toArray();
        if (foundFamily.length > 0) {
            res.status(200).json(foundFamily[0]);
        }
        else {
            res.status(404).send("family cannot be found");
        }
    }));
})
    .put((req, res) => {
    const familyID = req.params.id, family = req.body, { error } = schemas_1.FamilySchema.validate(family);
    if (error) {
        res.status(400).send(error.details[0].message);
    }
    else {
        (0, db_1.db_run)((database) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield FamilyTable(database).updateOne({ _id: new mongodb_1.ObjectId(familyID) }, { $set: family });
            if (result.matchedCount === 1) {
                res.status(200).json(family);
            }
            else {
                res.status(404).send("Failed to update, cause family cannot be found");
            }
        }));
    }
})
    .delete((req, res) => {
    const familyID = req.params.id;
    (0, db_1.db_run)((database) => __awaiter(void 0, void 0, void 0, function* () {
        let result = yield FamilyTable(database).deleteOne({ _id: new mongodb_1.ObjectId(familyID) });
        if (result.deletedCount == 1) {
            res.status(200).send("family has been deleted");
        }
        else {
            res.status(400).send("Failed to delete family, family has already been deleted");
        }
    }));
});
exports.default = FamilyRoute;
