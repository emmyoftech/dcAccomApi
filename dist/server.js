"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const attendee_1 = __importDefault(require("./routes/attendee"));
const family_1 = __importDefault(require("./routes/family"));
const group_1 = __importDefault(require("./routes/group"));
const accomodation_1 = __importDefault(require("./routes/accomodation"));
const paymentdetails_1 = __importDefault(require("./routes/paymentdetails"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: (_a = process.env.ALLOWED_HOSTS) === null || _a === void 0 ? void 0 : _a.split(","),
    methods: 'GET,PUT,POST,DELETE',
    credentials: true
}));
app.use(express_1.default.json());
app.use("/attendee", attendee_1.default);
app.use("/family", family_1.default);
app.use("/group", group_1.default);
app.use("/accomodation", accomodation_1.default);
app.use("/paymentdetails", paymentdetails_1.default);
app.get("/", (req, res) => {
    res.status(200).send("hello");
});
app.listen((_b = process.env.PORT) !== null && _b !== void 0 ? _b : 4000, () => { var _a; return console.log((_a = "listening on port " + process.env.PORT) !== null && _a !== void 0 ? _a : 4000 + "..."); });
