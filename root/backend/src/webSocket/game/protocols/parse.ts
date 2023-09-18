import { nanoid } from "nanoid";
import { Store, Direction, Gamemode } from "../../../interfaces";
import * as send from "../../app/protocols/send";
import { setBricks, setApple } from "../game";

export function createLobby(store: Store, userID: number) {
  const lobbyID = nanoid();
  const user = store.users[store.users.findIndex((user) => user.id === userID)];

  if (!user.lobby) {
    store.lobbies.push({
      id: lobbyID,
      users: [{ id: userID, leader: true }],
    });

    store.users[store.users.findIndex((user) => user.id === userID)].lobby =
      lobbyID;

    console.log(`Lobby id ${lobbyID} has been created`);

    send.lobbiesForEveryone(store);
    send.usersForEveryone(store);
  } else {
    console.log(`User ${userID} is already in lobby`);
  }
}

export function invite(
  store: Store,
  userID: number,
  to: number,
  lobbyID: string
) {
  const reciever = store.users.findIndex((user) => user.id === to);

  const inviteID = nanoid();

  const invite = {
    id: inviteID,
    from: userID,
    to: to,
    lobbyID: lobbyID,
  };

  if (store.users[reciever].invites) {
    store.users[reciever].invites?.push(invite);
  } else {
    store.users[reciever].invites = [invite];
  }

  send.users(store, to);
}

export function acceptInvite(store: Store, userID: number, inviteID: string) {
  join(store, userID, inviteID);
}

export function declineInvite(store: Store, userID: number, inviteID: string) {
  const user = store.users.findIndex((user) => user.id === userID);
  store.users[user].invites?.forEach(
    (invite, index) =>
      invite.id === inviteID && store.users[user].invites?.splice(index, 1)
  );

  console.log("decline invite");
}

export function join(store: Store, userID: number, inviteID: string) {
  const user = store.users.findIndex((user) => user.id === userID);
  const invite = store.users[user].invites?.find(
    (invite) => invite.id === inviteID
  );

  if (invite) {
    const lobby = store.lobbies.findIndex(
      (lobby) => lobby.id === invite?.lobbyID
    );

    store.lobbies[lobby].users.push({
      id: userID,
      leader: false,
    });

    store.users[user].lobby = invite.lobbyID;

    send.lobbiesForEveryone(store);
    send.usersForEveryone(store);
  }
}

export function leave(store: Store, userID: number) {
  console.log("leave");

  const user = store.users.findIndex((user) => user.id === userID);
  const lobbyID = store.users[user].lobby;
  const lobby = store.lobbies.findIndex((lobby) => lobby.id === lobbyID);

  store.lobbies[lobby].users.forEach(
    (user, index) =>
      user.id === userID && store.lobbies[lobby].users.splice(index, 1)
  );
  store.users[user].lobby = null;

  send.lobbiesForEveryone(store);
  send.usersForEveryone(store);
}

export function kick(
  store: Store,
  userID: number,
  lobbyID: string,
  to: number
) {
  const user = store.users.findIndex((user) => user.id === userID);
  const users = store.lobbies.find((lobby) => lobby.id === lobbyID)?.users;

  if (users && users.find((user) => user.id === userID)?.leader) {
    leave(store, to);
  } else {
    console.log("User have no permission to kick users");
  }
}

export function start(
  store: Store,
  userID: number,
  lobbyID: string | null,
  mode: Gamemode
) {
  const gameID = nanoid();

  if (mode === "classic" || mode === "bricks") {
    store.games.push({
      id: gameID,
      mode: mode,
      users: [
        {
          id: userID,
          position: [
            [192, 0],
            [128, 0],
            [64, 0],
            [0, 0],
          ],
          direction: "right",
          score: 0,
          speed: 250,
        },
      ],
      level: 1,
      applePosition: [0, 0],
      bricksPosition: [],
      isRunning: true,
      isCounting: true,
      winner: undefined,
      loser: undefined,
    });

    setApple(store, gameID);
    setBricks(store, gameID);

    console.log(
      `Singleplayer ${mode} game ${gameID} has been started by user id ${userID}`
    );
  } else if (mode === "pvp") {
    const lobby = store.lobbies.findIndex((lobby) => lobby.id === lobbyID);

    if (store.lobbies[lobby]) {
      const user = store.lobbies[lobby].users.find(
        (user) => user.id === userID
      );

      user &&
        user.leader &&
        store.games.push({
          id: gameID,
          mode: mode,
          users: [
            {
              id: store.lobbies[lobby].users[0].id,
              position: [
                [192, 0],
                [128, 0],
                [64, 0],
                [0, 0],
              ],
              direction: "right",
              score: 0,
              speed: 250,
            },
            {
              id: store.lobbies[lobby].users[1].id,
              position: [
                [768, 960],
                [832, 960],
                [896, 960],
                [960, 960],
              ],
              direction: "left",
              score: 0,
              speed: 250,
            },
          ],

          level: 1,

          applePosition: [0, 0],
          bricksPosition: [],
          isRunning: true,
          isCounting: true,
          winner: undefined,
          loser: undefined,
        });
    }

    console.log(`Multiplayer game ${gameID} has started by user id ${userID}`);
  } else if (mode === "pve") {
    store.games.push({
      id: gameID,
      mode: mode,
      users: [
        {
          id: userID,
          position: [
            [192, 0],
            [128, 0],
            [64, 0],
            [0, 0],
          ],
          direction: "right",
          score: 0,
          speed: 250,
        },
        {
          id: "env",
          position: [
            [768, 960],
            [832, 960],
            [896, 960],
            [960, 960],
          ],
          direction: "left",
          score: 0,
          speed: 250,
        },
      ],

      level: 1,
      applePosition: [0, 0],
      bricksPosition: [],
      isRunning: true,
      isCounting: true,
      winner: undefined,
      loser: undefined,
    });
    console.log("pve game started with id", gameID);
  }
}

export const changeDirection = (
  store: Store,
  userID: number | "env",
  gameID: string,
  to: Direction
) => {
  const game = store.games.findIndex((game) => game.id === gameID);

  if (store.games[game]) {
    const user = store.games[game].users.findIndex(
      (user) => user.id === userID
    );

    if (userID === "env") {
      getRandomDirection(store, game);
    } else {
      store.games[game].users[user].direction = to;
    }

    send.game(store, gameID);
  }
};

const getRandomDirection = (store: Store, game: number) => {
  const env = store.games[game].users.findIndex((user) => user.id === "env");
  if (env) {
    const randomNumber = Math.floor(Math.random() * 3);
    const directions: Direction[] = ["left", "right", "up", "down"];

    const currentDirection = store.games[game].users[env].direction;
    const newDirection = directions[randomNumber];
    if (currentDirection === "left" && newDirection === "right") {
      getRandomDirection(store, game);
    } else if (currentDirection === "right" && newDirection === "left") {
      getRandomDirection(store, game);
    } else if (currentDirection === "up" && newDirection === "down") {
      getRandomDirection(store, game);
    } else if (currentDirection === "down" && newDirection === "up") {
      getRandomDirection(store, game);
    } else {
      store.games[game].users[env].direction = newDirection;
    }
  }
};

export const pause = (store: Store, userID: number, gameID: string) => {
  const game = store.games.findIndex((game) => game.id === gameID);

  if (store.games[game]) {
    store.games[game].isRunning = !store.games[game].isRunning;
    send.game(store, gameID);
  }
};

export const leaveGame = (store: Store, userID: number, gameID: string) => {
  const userIndex = store.users.findIndex((user) => user.id === userID);
  const gameIndex = store.games.findIndex((game) => game.id === gameID);

  if (store.games[gameIndex]) {
    store.games[gameIndex].users = store.games[gameIndex].users.filter(
      (user) => user.id !== userID
    );

    console.log(`User ${userID} successfully leaved game ${gameID}`);

    const users = store.games[gameIndex].users;

    if (users.length === 0 || (users.length === 1 && users[0].id === "env")) {
      store.games = store.games.filter((game) => game.id !== gameID);
      console.log(`Game ${gameID} deleted. Games left: ${store.games.length}`);
    }
  }
};

export const setNewLevel = (store: Store, gameID: string) => {
  const game = store.games.find((game) => game.id === gameID);
  const gameIndex = store.games.findIndex((game) => game.id === gameID);

  const speedPerLevel = 20;

  if (game) {
    if (game.level < 9) {
      store.games[gameIndex].level += 1;
      store.games[gameIndex].users[0] = {
        ...game.users[0],
        position: [
          [192, 0],
          [128, 0],
          [64, 0],
          [0, 0],
        ],
        direction: "right",
        speed: game.users[0].speed - speedPerLevel,
      };
      store.games[gameIndex].isRunning = true;
    }
  }
  setBricks(store, gameID);
  setApple(store, gameID);
};
