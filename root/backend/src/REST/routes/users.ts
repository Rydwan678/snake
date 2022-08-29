import express from "express";
import authorization from "../middleware/authorization";
import {
  get,
  getAll,
  getMe,
  update,
  remove,
} from "../controllers/usersController";

const router = express.Router();

router.get("/users/:id", authorization, get);

router.get("/users", authorization, getAll);

router.get("/me", authorization, getMe);

router.patch("/users/:id", authorization, update);

router.delete("/users/:id", authorization, remove);

module.exports = router;
