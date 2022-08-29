import { Pool } from "pg";
import { DATABASE } from "../configs/database";

export const pool = new Pool(DATABASE);
