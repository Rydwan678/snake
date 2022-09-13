import { Store } from "./interfaces";
import * as express from "./REST/index";
import * as webSocket from "./webSocket";

const store: Store = { users: [], lobbies: [], games: [] };

express.load(store);
webSocket.load(store);
