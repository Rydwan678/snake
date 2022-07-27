import jwt from "jsonwebtoken";
import express from "express";
import cors from "cors";

const pool = require("./database");

const ACCESS_TOKEN = "123456789";

async function main() {
  const app = express();

  const routes = require("./routes");

  app.use(cors());
  app.use(express.json());

  app.use("", routes);

  app.get("/*", (req: any, res: any) => {
    res.end();
  });

  app.listen(5500, () => {
    console.log("server started");
  });
}

main();
