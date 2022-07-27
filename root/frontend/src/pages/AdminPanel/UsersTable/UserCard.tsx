import React from "react";
import { BsCheckLg } from "react-icons/bs";

interface UserCardProps {
  id: number;
  name: string;
  email: string;
  dateOfBirth: string;
  isSelected: boolean;
  selectUser: (id: number) => void;
  showUserProfile: (userID: number) => void;
  mode: string;
}

export default function UserCard(props: UserCardProps) {
  const checkBoxElement = (
    <div className="check-box" onClick={() => props.selectUser(props.id)}>
      {props.isSelected && <BsCheckLg className="check-mark" />}
    </div>
  );

  return (
    <div className="user-card">
      {props.mode === "edit" && checkBoxElement}
      <div
        className="user-card-container"
        onDoubleClick={() => props.showUserProfile(props.id)}
      >
        <div className="user-info">
          <div className="user--picture">
            <img
              src="https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg"
              alt="user"
              className="user-picture"
            />
          </div>
          <div className="user--id">
            <p>{props.id}</p>
          </div>
          <div className="user--name">
            <p>{props.name}</p>
          </div>
          <div className="user--email">
            <p>{props.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
