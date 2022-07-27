import React, { useEffect } from "react";
import { Virtuoso } from "react-virtuoso";
import UserCard from "./UserCard";
import { User, Table as TableType, Mode } from "../../../types";

interface TableProps {
  users: User[];
  table: TableType;
  mode: Mode;
  selectUser: (id: number) => void;
  showUserProfile: (userID: number) => void;
}

export default function Table(props: TableProps) {
  const usersElement = props.users.map((user: User) => (
    <UserCard
      name={user.name}
      id={user.id}
      email={user.email}
      dateOfBirth={user.dateOfBirth}
      isSelected={user.isSelected}
      selectUser={props.selectUser}
      mode={props.mode}
      showUserProfile={props.showUserProfile}
    />
  ));

  if (props.table === "pages") {
    console.log("gowno1", props.table);
    return <div>{usersElement}</div>;
  } else if (props.table === "virtual") {
    console.log("vortuoso", props.table);
    return (
      <div>
        <Virtuoso
          style={{ height: "640px" }}
          totalCount={props.users.length}
          itemContent={(index) => {
            const user = props.users[index];

            return (
              <UserCard
                name={user.name}
                id={user.id}
                email={user.email}
                dateOfBirth={user.dateOfBirth}
                isSelected={user.isSelected}
                selectUser={props.selectUser}
                mode={props.mode}
                showUserProfile={props.showUserProfile}
              />
            );
          }}
        />
      </div>
    );
  }
  return <div></div>;
}
