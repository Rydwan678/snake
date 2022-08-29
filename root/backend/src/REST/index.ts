import express from "express";
import cors from "cors";
import { PORT } from "./configs/server";
import { Store } from "../interfaces";

export function load(store: Store) {
  const routes = require("./routes");

  store.app = express();

  store.app.use(cors());
  store.app.use(express.json());
  store.app.use("", routes);

  store.app.get("/*", (req: any, res: any) => {
    res.end();
  });

  store.server = store.app.listen(PORT, () => {
    console.log(`server started at port ${PORT}`);
  });
}
