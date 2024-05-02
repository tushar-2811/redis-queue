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
const redis_1 = require("redis");
const port = 8000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
const client = (0, redis_1.createClient)();
function clientConnect() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        console.log("connected to redis");
    });
}
clientConnect();
app.post('/submit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { problemId, userId, code, language } = req.body;
        // push this to database postgres
        yield client.lPush("submissions", JSON.stringify({ problemId, userId, code, language }));
        return res.status(200).json({
            success: true,
            message: "submission recieved"
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            error: error
        });
    }
}));
app.listen(port, () => {
    console.log(`server is listening on port : ${port}`);
});
