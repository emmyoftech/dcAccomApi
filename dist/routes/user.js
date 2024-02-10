"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserRoute = express_1.default.Router();
UserRoute.use((req, res, next) => {
    if (req.method.toLowerCase() !== "get" && req.headers["content-type"] !== "application/json") {
        res.status(500).send(`content-type must be of 'application/json' not '${req.headers["content-type"]}'`);
        res.end();
    }
    next();
});
UserRoute.route("/")
    .get((req, res) => {
    res.send("hello this is users");
})
    .post((req, res) => {
    res.send(req.body);
});
exports.default = UserRoute;
