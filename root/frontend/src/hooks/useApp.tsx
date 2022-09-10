import React, { useState, useEffect, useRef } from "react";
import { Packet, Message } from "../../../shared/interfaces";
import { getMe } from "../ApiServices";
import { Settings, Setting } from "../types";

export default function useApp() {
  const [users, setUsers] =
    useState<
      { id: number; messages: Message[] | undefined; online: boolean }[]
    >();
  const [me, setMe] = useState<number>();
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
          if (users) {
            const updatedUsers = users?.map((user) => {
              if (packet.data.users.includes(user.id)) {
                return {
                  ...user,
                  online: true,
                };
              } else {
                return {
                  ...user,
                  online: false,
                };
              }
            });

            packet.data.users.forEach((userID) => {
              if (!users.find((user) => user.id === userID)) {
                updatedUsers.push({
                  id: userID,
                  messages: undefined,
                  online: true,
                });
              }
            });

            setUsers([...updatedUsers]);
          } else if (!users) {
            setUsers(
              packet.data.users.map((user) => ({
                id: user,
                messages: undefined,
                online: true,
              }))
            );
          }
        }

        if (packet?.packetId === "message") {
          recieveMessage(
            packet.data.message?.from as number,
            packet.data.message?.content as string,
            packet.data.message?.id as number
          );
        }

        if (packet.packetId === "messageInfo") {
          console.log("messageinfo");
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

      const response = await getMe(localStorage.getItem("token"));

      setMe(response[0].id);
    }

    webSocketConnection();

    const pingInterval = setInterval(() => {
      if (ws.current?.readyState === 2 || ws.current?.readyState === 3) {
        console.log("Server is closed. Trying to reconnect");
        reconnect();
        return;
      }
      ws.current?.send(
        JSON.stringify({
          packetId: "ping",
          data: { userToken: localStorage.getItem("token") },
        })
      );
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

  function connect() {
    ws.current?.send(
      JSON.stringify({
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
      console.log("updatedusersinfo", updatedUsers, to);
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

  return {
    users: users,
    me: me,
    recipient: recipient,
    settings: settings,
    fn: {
      sendMessage: sendMessage,
      changeRecipient: changeRecipient,
      sendReadStatus: sendReadStatus,
      changeGamemode: changeGamemode,
      changeDifficulty: changeDifficulty,
      toggleSetting: toggleSetting,
      connect: connect,
    },
  };
}
