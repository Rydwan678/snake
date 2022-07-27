import React, { useState, useEffect } from "react";
import UsersTable from "./UsersTable";
import UserProfile from "./UserProfile";
import { Window } from "../../types";
import Box from "@mui/material/Box";

export default function AdminPanel() {
  const [info, setInfo] = useState<string | null>(null);
  const [window, setWindow] = useState<Window>("usersTable");

  const [currentlyShownUser, setCurrentlyShownUser] = useState({
    name: "",
    email: "",
    age: "",
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setInfo(null);
    }, 4000);
    return () => clearTimeout(timeout);
  }, [info]);

  async function showUserProfile(userID: number) {
    console.log(userID);
    try {
      const response = await await fetch("http://127.0.0.1:5500/getUser", {
        method: "POST",
        body: JSON.stringify({ userID }),
        headers: {
          "Content-type": "application/json",
        },
      });
      const data = await response.json();
      const user = data.user;
      setCurrentlyShownUser({
        ...user,
      });
      setWindow("userProfile");
    } catch (error) {
      console.log("error");
    }
  }

  return <Box></Box>;
}

{
  /* <div className="admin-panel">
        {window === "usersTable" && (
          <UsersTable
            setInfo={(message: string) => setInfo(message)}
            showUserProfile={showUserProfile}
          />
        )}
        {window === "userProfile" && (
          <UserProfile
            user={currentlyShownUser}
            setWindow={(selectedWindow: Window) => setWindow(selectedWindow)}
          />
        )}
      </div>
      {info && <p className="info">{info}</p>} */
}
