import React, { useState } from "react";
import { Window } from "../../types";

interface UserProfileProps {
  user: {
    name: string;
    email: string;
    age: string;
  };
  setWindow: (window: Window) => void;
}

export default function UserProfile(props: UserProfileProps) {
  const [updatedData, setUpdatedData] = useState<UserProfileProps | null>(null);

  function checkForChanges(inputName: string) {}

  return (
    <div className="user-profile">
      <div className="user-profile--info">
        <p>Name</p>
        <input
          defaultValue={props.user.name}
          onChange={() => checkForChanges("name")}
        ></input>
      </div>
      <div className="user-profile--info">
        <p>Email</p>
        <input
          defaultValue={props.user.email}
          onChange={() => checkForChanges("email")}
        ></input>
      </div>
      <div className="user-profile--info">
        <p>Date of birth</p>
        <input
          defaultValue={props.user.age}
          onChange={() => checkForChanges("age")}
        ></input>
      </div>
      <button onClick={() => props.setWindow("usersTable")}>
        <p>BACK</p>
      </button>
      {updatedData && (
        <button>
          <p>SAVE</p>
        </button>
      )}
      {updatedData && (
        <button>
          <p>DISCARD</p>
        </button>
      )}
    </div>
  );
}
