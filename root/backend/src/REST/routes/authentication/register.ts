import express from "express";
import { registerController } from "../../controllers/authentication";

const pool = require("../../database/pool");
const router = express.Router();

router.post("/register", registerController);

module.exports = router;
