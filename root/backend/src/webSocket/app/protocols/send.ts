import { Store } from "../../../interfaces";

export function users(store: Store, userID: number) {
  const user = store.users.find((user) => user.id === userID);

  user?.ws.send(
    JSON.stringify({
      packetId: "getUsers",
      data: {
        users: store.users.map((user) => ({
          id: user.id,
          lobby: user.lobby,
          invites: user.invites,
        })),
      },
    })
  );
}

export function usersForEveryone(store: Store) {
  store.users.forEach((user) =>
    user?.ws.send(
      JSON.stringify({
        packetId: "getUsers",
        data: {
          users: store.users.map((user) => ({
            id: user.id,
            lobby: user.lobby,
            invites: user.invites,
          })),
        },
      })
    )
  );
}

export function lobbies(store: Store, userID: number) {
  const user = store.users.find((user) => user.id === userID);

  user?.ws.send(
    JSON.stringify({
      packetId: "lobby",
      data: {
        lobby: {
          action: "getLobbies",
          lobbies: store.lobbies,
        },
      },
    })
  );

  console.log("send getLobbies", userID);
}

export function lobbiesForEveryone(store: Store) {
  store.users.forEach((user) =>
    user?.ws.send(
      JSON.stringify({
        packetId: "lobby",
        data: {
          lobby: {
            action: "getLobbies",
            lobbies: store.lobbies,
          },
        },
      })
    )
  );
}

export function game(store: Store, gameID: string) {
  const game = store.games.findIndex((game) => game.id === gameID);

  store.games[game].users.forEach((player) =>
    store.users
      .find((user) => user.id === player.id)
      ?.ws.send(
        JSON.stringify({
          packetId: "gameInfo",
          data: {
            game: {
              data: store.games[game],
            },
          },
        })
      )
  );
}
