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
const PaymentDetailsRoute = express_1.default.Router();
PaymentDetailsRoute.use((req, res, next) => {
    if (req.method.toLowerCase() !== "get" && req.headers["content-type"] !== "application/json") {
        res.status(500).send(`content-type must be of 'application/json' not '${req.headers["content-type"]}'`);
        res.end();
    }
    next();
});
const PaymentDetailsTable = (database) => database.collection("paymentdetails");
PaymentDetailsRoute.route("/")
    .get((req, res) => {
    (0, db_1.db_run)((database) => __awaiter(void 0, void 0, void 0, function* () {
        const paymentdetailsArray = yield PaymentDetailsTable(database).find({}).toArray();
        if (paymentdetailsArray.length > 0) {
            res.status(200).json(paymentdetailsArray);
        }
        else {
            res.status(404).send("no payment details available");
        }
    }));
})
    .post((req, res) => {
    const paymentdetail = req.body, { error } = schemas_1.PaymentDetailsSchema.validate(paymentdetail);
    if (error) {
        res.status(400).send(error.details[0].message);
    }
    else {
        (0, db_1.db_run)((database) => __awaiter(void 0, void 0, void 0, function* () {
            const { insertedId } = yield PaymentDetailsTable(database).insertOne(paymentdetail);
            if (insertedId) {
                res.status(201).send("Payment Detail registered successfully");
            }
            else {
                res.status(400).send("Failed to register Payment Detail");
            }
        }));
    }
});
PaymentDetailsRoute.route("/:id")
    .get((req, res) => {
    const { id } = req.params;
    (0, db_1.db_run)((database) => __awaiter(void 0, void 0, void 0, function* () {
        const foundPaymentDetail = yield PaymentDetailsTable(database).findOne({ _id: new mongodb_1.ObjectId(id) });
        if (foundPaymentDetail != null) {
            res.status(200).json(foundPaymentDetail);
        }
        else {
            res.status(404).send("payment detail cannot be found");
        }
    }));
})
    .put((req, res) => {
    const { id } = req.params, paymentdetail = req.body, { error } = schemas_1.PaymentDetailsSchema.validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
    }
    else {
        (0, db_1.db_run)((database) => __awaiter(void 0, void 0, void 0, function* () {
            const { matchedCount } = yield PaymentDetailsTable(database).updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: paymentdetail });
            if (matchedCount == 1) {
                res.status(200).json(paymentdetail);
            }
            else {
                res.status(404).send("Failed to update, cause payment detail cannot be found");
            }
        }));
    }
})
    .delete((req, res) => {
    const { id } = req.params;
    (0, db_1.db_run)((database) => __awaiter(void 0, void 0, void 0, function* () {
        const { deletedCount } = yield PaymentDetailsTable(database).deleteOne({ _id: new mongodb_1.ObjectId(id) });
        if (deletedCount == 1) {
            res.status(200).send("payment detail deleted successfully");
        }
        else {
            res.status(400).send("Failed to delete payment detail, payment detail has already been deleted");
        }
    }));
});
exports.default = PaymentDetailsRoute;
