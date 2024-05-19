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
const app = (0, express_1.default)();
const PORT = 3000;
let redisClient;
function connectToRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            redisClient = (0, redis_1.createClient)();
            yield redisClient.connect();
            console.log("Connected to local redis here");
        }
        catch (error) {
            console.log("error while connecting to redis", error);
        }
    });
}
connectToRedis();
app.use(express_1.default.json());
function expensiveOperation() {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve) => setTimeout(resolve, 1000));
        return {
            username: "tushar",
            email: "tushar@gmail.com"
        };
    });
}
app.get('/uncached', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield expensiveOperation();
    return res.status(201).json(data);
}));
app.get('/cached', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cachedData = yield redisClient.get('data');
    if (cachedData) {
        return res.status(201).json(cachedData);
    }
    const data = yield expensiveOperation();
    yield redisClient.set('data', JSON.stringify(data));
    return res.status(201).json({
        data
    });
}));
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
