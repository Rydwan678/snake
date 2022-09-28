import { FiberNew } from "@mui/icons-material";
import React, { useState, useEffect, useRef } from "react";
import {
  Packet,
  Message,
  User,
  LobbyType,
  Game,
  Direction,
} from "../../../shared/interfaces";
import { getMe } from "../ApiServices";
import { Settings, Setting, Alert, AlertType } from "../types";

export default function useApp() {
  const [users, setUsers] = useState<User[]>();
  const [lobbies, setLobbies] = useState<LobbyType[] | null>(null);
  const [me, setMe] = useState<number>();
  const [lobby, setLobby] = useState<LobbyType | null>(null);
  const [recipient, setRecipient] = useState<number>();
  const [settings, setSettings] = useState<Settings>({
    audio: true,
    difficulty: {
      name: "NORMAL",
      speedPerLevel: 12,
      bricksPerLevel: 5,
    },
    gamemode: "",
  });

  const [game, setGame] = useState<Game | null>(null);

  const [alert, setAlert] = useState<Alert>({
    open: false,
    type: "info",
    message: "",
    inviteID: undefined,
  });

  const [pool, setPool] = useState<Packet[]>([]);
  const poolRef = useRef<Packet[]>([]);

  const ws = useRef<WebSocket | null>(null);

  function handlePacket() {
    const packet = poolRef.current.shift();
    if (packet) {
      setPool((previousPool) => [...previousPool, packet]);
    }
  }

  useEffect(() => {
    if (pool.length > 0) {
      const packet = pool[0];
      if (packet) {
        if (packet?.packetId === "getUsers") {
          console.log("getUsers", packet.data.users);
          if (users) {
            const updatedUsers = users?.map((user) => {
              const prevUser = packet.data.users.find(
                (prevUser) => prevUser.id === user.id
              );

              if (prevUser) {
                return {
                  ...user,
                  invites: prevUser.invites,
                  lobby: prevUser.lobby,
                  online: true,
                };
              } else {
                return {
                  ...user,
                  online: false,
                };
              }
            });

            packet.data.users.forEach((prevUser) => {
              if (!users.find((user) => user.id === prevUser.id)) {
                updatedUsers.push({
                  id: prevUser.id,
                  messages: undefined,
                  online: true,
                  lobby: prevUser.lobby,
                  invites: prevUser.invites,
                });
              }
            });

            setUsers([...updatedUsers]);
          } else if (!users) {
            setUsers(
              packet.data.users.map((user) => ({
                id: user.id,
                messages: undefined,
                online: true,
                lobby: user.lobby,
                invites: user.invites,
              }))
            );
          }
        }

        if (packet.packetId === "lobby") {
          if (packet.data.lobby.action === "getLobbies") {
            packet.data.lobby.lobbies &&
              setLobbies([...packet.data.lobby.lobbies]);
          }
        }

        if (packet.packetId === "gameInfo") {
          setGame(packet.data.game.data);
        }

        if (packet?.packetId === "message") {
          recieveMessage(
            packet.data.message?.from as number,
            packet.data.message?.content as string,
            packet.data.message?.id as number
          );
        }

        if (packet.packetId === "messageInfo") {
          if (packet.data.messageInfo && users) {
            if (packet.data.messageInfo.info === "sent") {
              setMessageStatus(
                "sent",
                packet.data.messageInfo.to,
                packet.data.messageInfo.messageId
              );
            } else if (packet?.data.messageInfo.info === "read") {
              setMessageStatus("read", packet.data.messageInfo.to);
            }
          }
        }

        const updatedPool = [...pool];
        updatedPool.shift();
        setPool(updatedPool);
      }
    }
  }, [pool]);

  useEffect(() => {
    async function webSocketConnection() {
      const response = await getMe(localStorage.getItem("token"));
      setMe(response[0].id);

      ws.current = new WebSocket("ws://localhost:8080");
      ws.current.onopen = (e) => {
        if (localStorage.getItem("token")) {
          console.log("open");
          connect();
        }
      };

      ws.current.onclose = (e) => {
        console.log("close:", e);
      };

      ws.current.onmessage = async (e) => {
        const packet: Packet = JSON.parse(e.data);

        poolRef.current.push(packet);
      };
    }

    webSocketConnection();

    const pingInterval = setInterval(() => {
      if (ws.current?.readyState === 1) {
        ws.current?.send(
          JSON.stringify({
            module: "app",
            packetId: "ping",
            data: { userToken: localStorage.getItem("token") },
          })
        );
      } else {
        console.log("Server is closed. Trying to reconnect");
        reconnect();
        return;
      }
    }, 1000);

    const handlePacketInterval = setInterval(() => {
      handlePacket();
    }, 100);

    return () => {
      ws.current && ws.current.close();
      clearInterval(pingInterval);
      clearInterval(handlePacketInterval);
    };
  }, []);

  useEffect(() => {
    console.log("useApp users", users);
    if (users && me && recipient === undefined) {
      const user = users.find((user) => user.id !== me);
      user && setRecipient(user.id);
    }
  }, [users]);

  useEffect(() => {
    if (recipient) {
      sendReadStatus();
    }
  }, [recipient]);

  useEffect(() => {
    showInvite();
  }, [alert && users]);

  useEffect(() => {
    if (users) {
      const meIndex = users.findIndex((user) => user.id === me);

      if (users[meIndex].lobby && lobbies) {
        const myLobby = lobbies.find(
          (lobby) => lobby.id === users[meIndex].lobby
        );

        myLobby && setLobby(myLobby);
      } else {
        setLobby(null);
      }
    }
  }, [lobbies, users]);

  function connect() {
    ws.current?.send(
      JSON.stringify({
        module: "app",
        packetId: "connect",
        data: { userToken: localStorage.getItem("token") as string },
      })
    );
  }

  function reconnect() {
    ws.current?.close();
    ws.current = new WebSocket("ws://localhost:8080");
  }

  function changeRecipient(id: number) {
    setRecipient(id);
  }

  async function sendMessage(content: string) {
    if (content && me && recipient) {
      if (users && recipient) {
        const recipientIndex = users.findIndex((user) => user.id === recipient);
        const messages = users[recipientIndex].messages;

        const messageID = messages ? messages[messages.length - 1].id + 1 : 1;

        const message: Message = {
          id: messageID,
          from: me,
          to: recipient,
          content: content,
          sent: false,
          recieved: false,
          read: false,
        };

        const updatedUsers = users;

        if (!messages) {
          updatedUsers[recipientIndex].messages = [message];
          setUsers([...updatedUsers]);
        }
        if (messages) {
          updatedUsers[recipientIndex].messages = [...messages, message];
          setUsers([...updatedUsers]);
        }
        try {
          await ws.current?.send(
            JSON.stringify({
              module: "chat",
              packetId: "message",
              data: {
                message: {
                  to: recipient,
                  content: content,
                  id: messageID,
                },
                userToken: localStorage.getItem("token"),
              },
            })
          );
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  async function recieveMessage(
    from: number,
    content: string,
    messageID: number
  ) {
    if (me) {
      const message: Message = {
        id: messageID,
        from: from,
        to: me,
        content: content,
        sent: true,
        recieved: true,
        read: false,
      };

      const updatedUsers = users;

      if (updatedUsers) {
        const messages =
          updatedUsers[updatedUsers.findIndex((user) => user.id === from)]
            .messages;

        if (!messages) {
          updatedUsers[
            updatedUsers.findIndex((user) => user.id === from)
          ].messages = [message];
          setUsers([...updatedUsers]);
        }

        if (messages) {
          updatedUsers[
            updatedUsers.findIndex((user) => user.id === from)
          ].messages?.push(message);
          setUsers([...updatedUsers]);
        }
      }
    }

    if (from === recipient) {
      sendReadStatus();
    }
  }

  async function sendReadStatus() {
    try {
      await ws.current?.send(
        JSON.stringify({
          module: "chat",
          packetId: "messageInfo",
          data: {
            messageInfo: {
              info: "read",
              to: recipient,
            },
            userToken: localStorage.getItem("token"),
          },
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  function setMessageStatus(
    info: "sent" | "recieved" | "read",
    to: number,
    messageID?: number
  ) {
    if (info === "read") {
      const updatedUsers = users?.map((user) =>
        user.id === to
          ? {
              ...user,
              messages: user.messages?.map((message) => ({
                ...message,
                read: true,
              })),
            }
          : user
      );

      setUsers(updatedUsers);
      return;
    }

    const updatedUsers = users?.map((user) => ({
      ...user,
      messages: user.messages?.map((message) =>
        message.id === messageID && user.id === recipient
          ? { ...message, [info]: true }
          : message
      ),
    }));

    updatedUsers && setUsers([...updatedUsers]);
  }

  function changeDifficulty() {
    const levels = [
      {
        name: "EASY",
        speedPerLevel: 6,
        bricksPerLevel: 4,
      },
      {
        name: "NORMAL",
        speedPerLevel: 12,
        bricksPerLevel: 5,
      },
      {
        name: "HARD",
        speedPerLevel: 18,
        bricksPerLevel: 6,
      },
    ];
    const currentLevel = levels.findIndex(
      (element) => element.name === settings.difficulty.name
    );
    const nextLevel = levels[currentLevel + 1]
      ? levels[currentLevel + 1]
      : levels[0];
    setSettings((previousSettings) => ({
      ...previousSettings,
      difficulty: nextLevel,
    }));
  }

  function changeGamemode(selectedGamemode: string) {
    setSettings((previousSettings) => ({
      ...previousSettings,
      gamemode: selectedGamemode,
    }));
  }

  function toggleSetting(setting: Setting) {
    setSettings((previousSettings) => ({
      ...previousSettings,
      [setting]: !previousSettings[setting],
    }));
  }

  async function createLobby() {
    try {
      await ws.current?.send(
        JSON.stringify({
          module: "game",
          packetId: "lobby",
          data: {
            lobby: {
              action: "create",
            },
            userToken: localStorage.getItem("token"),
          },
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function getLobbies() {
    try {
      console.log("Sending getLobbies request 1", ws.current?.readyState);
      await ws.current?.send(
        JSON.stringify({
          module: "game",
          packetId: "lobby",
          data: {
            lobby: {
              action: "getLobbies",
            },
            userToken: localStorage.getItem("token"),
          },
        })
      );
      console.log("Sending getLobbies request 2");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    console.log("lobbiesss", lobbies);
  }, [lobbies]);

  async function invite(lobbyID: string, userID: number) {
    try {
      await ws.current?.send(
        JSON.stringify({
          module: "game",
          packetId: "lobby",
          data: {
            lobby: {
              action: "invite",
              lobbyID: lobbyID,
              to: userID,
            },
            userToken: localStorage.getItem("token"),
          },
        })
      );
      showAlert("success", `Invite has been sent to user id ${userID}`);
    } catch (error) {
      console.log(error);
    }
  }

  async function declineInvite(inviteID: string) {
    try {
      await ws.current?.send(
        JSON.stringify({
          module: "game",
          packetId: "lobby",
          data: {
            lobby: {
              action: "declineInvite",
              inviteID: inviteID,
            },
            userToken: localStorage.getItem("token"),
          },
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function acceptInvite(inviteID: string) {
    try {
      await ws.current?.send(
        JSON.stringify({
          module: "game",
          packetId: "lobby",
          data: {
            lobby: {
              action: "acceptInvite",
              inviteID: inviteID,
            },
            userToken: localStorage.getItem("token"),
          },
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function leaveLobby() {
    try {
      await ws.current?.send(
        JSON.stringify({
          module: "game",
          packetId: "lobby",
          data: {
            lobby: {
              action: "leave",
            },
            userToken: localStorage.getItem("token"),
          },
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function kick(to: number) {
    try {
      await ws.current?.send(
        JSON.stringify({
          module: "game",
          packetId: "lobby",
          data: {
            lobby: {
              action: "kick",
              lobbyID: lobby?.id,
              to: to,
            },
            userToken: localStorage.getItem("token"),
          },
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  function showInvite() {
    if (users && !alert.open) {
      const invites = users.find((user) => user.id === me)?.invites;

      if (invites && invites[0]) {
        showAlert("info", `Someone invited you to their lobby`, invites[0].id);
      }
    }
  }

  async function startGame() {
    console.log("startwr", lobby ? lobby.id : null);
    try {
      await ws.current?.send(
        JSON.stringify({
          module: "game",
          packetId: "start",
          data: {
            game: {
              lobbyID: lobby ? lobby.id : null,
            },
            userToken: localStorage.getItem("token"),
          },
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function changeDirection(e: React.KeyboardEvent) {
    if (game) {
      let direction = game.users.find((user) => user.id === me)?.direction;

      if (direction) {
        if (e.key === "w") {
          if (direction !== "down") {
            direction = "up";
          }
        } else if (e.key === "s") {
          if (direction !== "up") {
            direction = "down";
          }
        } else if (e.key === "a") {
          if (direction !== "right") {
            direction = "left";
          }
        } else if (e.key === "d") {
          if (direction !== "left") {
            direction = "right";
          }
        }

        try {
          await ws.current?.send(
            JSON.stringify({
              module: "game",
              packetId: "move",
              data: {
                game: {
                  id: game.id,
                  to: direction,
                },
                userToken: localStorage.getItem("token"),
              },
            })
          );
        } catch (error) {
          console.log(error);
        }
      }

      // if (e.key === "Escape") {
      //   console.log("test");
      //   gameDataRef.current.isRunning = !gameDataRef.current.isRunning;
      //   gameDataRef.current.popup = {
      //     isShown: !gameDataRef.current.popup.isShown,
      //     type: "gamePaused",
      //   };
      // }
    }
  }

  function showAlert(type: AlertType, message: string, inviteID?: string) {
    if (inviteID) {
      setAlert({
        open: true,
        type: type,
        message: message,
        inviteID: inviteID,
      });
    } else {
      setAlert({
        open: true,
        type: type,
        message: message,
      });
    }
  }

  const handleAlertClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    if (alert.inviteID) {
      declineInvite(alert.inviteID);
    }

    setAlert((previousAlert) => ({
      ...previousAlert,
      open: false,
    }));
  };

  return {
    users: users,
    lobbies: lobbies,
    me: me,
    lobby: lobby,
    recipient: recipient,
    settings: settings,
    game: game,
    alert: alert,
    fn: {
      sendMessage: sendMessage,
      changeRecipient: changeRecipient,
      sendReadStatus: sendReadStatus,
      changeGamemode: changeGamemode,
      changeDifficulty: changeDifficulty,
      toggleSetting: toggleSetting,
      connect: connect,
      createLobby: createLobby,
      getLobbies: getLobbies,
      invite: invite,
      acceptInvite: acceptInvite,
      leaveLobby: leaveLobby,
      kick: kick,
      showAlert: showAlert,
      handleAlertClose: handleAlertClose,
      startGame: startGame,
      changeDirection: changeDirection,
    },
  };
}
