import express from "express";
import { loginController } from "../../controllers/authentication";

const pool = require("../../database/pool");

const router = express.Router();

const ACCESS_TOKEN = "123456789";

router.post("/login", loginController);

module.exports = router;
