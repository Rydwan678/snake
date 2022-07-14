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
const { Client } = require("pg");
const client = new Client({
    user: "postgres",
    password: "admin",
    host: "localhost",
    port: 5432,
    database: "SNAKE",
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const cors = require("cors");
        const express = require("express");
        const app = express();
        const login = require("./routes/login");
        const register = require("./routes/register");
        app.use(cors());
        app.use(express.json());
        app.listen(2005, (error) => {
            if (error) {
                console.log("error");
            }
            console.log("server started");
        });
        app.get("/", (req, res) => {
            res.send("hello");
            res.end();
        });
        app.use("/", login);
        app.use("/", register);
    });
}
main();
