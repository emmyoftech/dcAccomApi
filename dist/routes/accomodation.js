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
const AccommodationRoute = express_1.default.Router({});
AccommodationRoute.use((req, res, next) => {
    if (req.method.toLowerCase() !== "get" && req.headers["content-type"] !== "application/json") {
        res.status(500).send(`content-type must be of 'application/json' not '${req.headers["content-type"]}'`);
        res.end();
    }
    next();
});
const AccomodationTable = (database) => database.collection("accomodation");
AccommodationRoute.route("/")
    .get((req, res) => {
    (0, db_1.db_run)((database) => __awaiter(void 0, void 0, void 0, function* () {
        const accomodationArray = yield AccomodationTable(database).find({}).toArray();
        if (accomodationArray.length > 1) {
            res.status(200).json(accomodationArray);
        }
        else {
            res.status(404).send("no accomodation available");
        }
    }));
})
    .post((req, res) => {
    const accomodation = req.body, { error } = schemas_1.AccomodationSchema.validate(accomodation);
    if (error) {
        res.status(400).send(error.details[0].message);
    }
    else {
        (0, db_1.db_run)((database) => __awaiter(void 0, void 0, void 0, function* () {
            const { insertedId } = yield AccomodationTable(database).insertOne(accomodation);
            if (insertedId) {
                res.status(201).send("Accomodation registered successfully");
            }
            else {
                res.status(400).send("Failed to register Accomodation");
            }
        }));
    }
});
AccommodationRoute.route("/:id")
    .get((req, res) => {
    const { id } = req.params;
    (0, db_1.db_run)((database) => __awaiter(void 0, void 0, void 0, function* () {
        const foundAccomodation = yield AccomodationTable(database).findOne({ _id: new mongodb_1.ObjectId(id) });
        if (foundAccomodation != null) {
            res.status(200).json(foundAccomodation);
        }
        else {
            res.status(404).send("accomodation cannot be found");
        }
    }));
})
    .put((req, res) => {
    const { id } = req.params, accomodation = req.body, { error } = schemas_1.AccomodationSchema.validate(accomodation);
    if (error) {
        res.status(400).send(error.details[0].message);
    }
    else {
        (0, db_1.db_run)((database) => __awaiter(void 0, void 0, void 0, function* () {
            const { matchedCount } = yield AccomodationTable(database).updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: accomodation });
            if (matchedCount == 1) {
                res.status(200).json(accomodation);
            }
            else {
                res.status(404).send("Failed to update, cause accomodation cannot be found");
            }
        }));
    }
})
    .delete((req, res) => {
    const { id } = req.params;
    (0, db_1.db_run)((database) => __awaiter(void 0, void 0, void 0, function* () {
        const { deletedCount } = yield AccomodationTable(database).deleteOne({ _id: new mongodb_1.ObjectId(id) });
        if (deletedCount == 1) {
            res.status(200).send("accomodation deleted successfully");
        }
        else {
            res.status(400).send("Failed to delete accomodation, accomodation has already been deleted");
        }
    }));
});
exports.default = AccommodationRoute;
