import React, { useState, useEffect } from "react";
import TopBar from "./TopBar";
import Table from "./Table";
import BottomBar from "./BottomBar";
import { User, Table as TableType, Sorting, Mode } from "../../../types";

interface UsersTableProps {
  setInfo: (message: string) => void;
  showUserProfile: (userID: number) => void;
}

export default function UsersTable(props: UsersTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [table, setTable] = useState<TableType>("virtual");
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [usersCount, setUsersCount] = useState(8);
  const [sorting, setSorting] = useState({
    orderBy: "id",
    mode: "ASC",
  });
  const [searchBar, setSearchBar] = useState("");
  const [mode, setMode] = useState<Mode>("browse");
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    getUsers();
  }, [page, sorting, searchBar, table, usersCount]);

  async function getUsers() {
    try {
      const response = await fetch("http://127.0.0.1:5500/getUsers", {
        method: "POST",
        body: JSON.stringify({ page, sorting, searchBar, usersCount, table }),
        headers: {
          "Content-type": "application/json",
        },
      });
      const data = await response.json();

      setPages(data.pages);

      let updatedUsers: User[] = [];

      data.users.forEach((user: User) =>
        updatedUsers.push({
          ...user,
          isSelected: false,
        })
      );

      setUsers(updatedUsers);
    } catch (error) {
      console.log("error", error);
    }
  }

  function selectUser(id: number) {
    const updatedUsers = users;
    const selectedUserIndex = users.findIndex((user) => user.id === id);
    updatedUsers[selectedUserIndex].isSelected =
      !updatedUsers[selectedUserIndex].isSelected;

    setUsers([...updatedUsers]);
  }

  async function deleteUsers() {
    try {
      const selectedUsers: number[] = [];

      users.forEach((user) =>
        user.isSelected ? selectedUsers.push(user.id) : () => {}
      );

      if (selectedUsers.length < 1) {
        props.setInfo("You haven't selected any users");
        return;
      }

      const response = await fetch("http://127.0.0.1:5500/deleteUsers", {
        method: "POST",
        body: JSON.stringify({ selectedUsers }),
        headers: {
          "Content-type": "application/json",
        },
      });
      const data = await response.json();

      props.setInfo(data.message);
      getUsers();
      setMenu(false);
    } catch (error) {
      console.log("error", error);
    }
  }

  function changeMode() {
    if (mode === "browse") {
      setMode("edit");
    } else {
      setMode("browse");
      setMenu(false);
    }
  }

  function handleTableChange(e: React.ChangeEvent<HTMLSelectElement>) {
    e.target.value === "pages" ? setTable("pages") : setTable("virtual");
  }

  function handleUsersCountChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setUsersCount(parseInt(e.target.value));
  }

  function changeSorting(orderBy: string) {
    setSorting((previousSorting) => ({
      orderBy: orderBy,
      mode: previousSorting.mode === "ASC" ? "DESC" : "ASC",
    }));
  }

  return (
    <div>
      <TopBar
        setSearchBar={(text: string) => setSearchBar(text)}
        changeSorting={changeSorting}
        deleteUsers={deleteUsers}
        setMenu={() => setMenu((prevMenu) => !prevMenu)}
        mode={mode}
        menu={menu}
        sorting={sorting}
      />
      <Table
        users={users}
        table={table}
        mode={mode}
        selectUser={selectUser}
        showUserProfile={props.showUserProfile}
      />
      <BottomBar
        page={page}
        pages={pages}
        table={table}
        setPage={(direction: string) =>
          direction === "next"
            ? setPage((previousPage) => previousPage + 1)
            : setPage((previousPage) => previousPage - 1)
        }
        changeMode={changeMode}
        handleUsersCountChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          handleUsersCountChange(e)
        }
        handleTableChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          handleTableChange(e)
        }
      />
    </div>
  );
}

// return (
//   <div>
//     <TopBar
//       setSearchBar={(text: string) => setSearchBar(text)}
//       changeSorting={changeSorting}
//       deleteUsers={deleteUsers}
//       setMenu={() => setMenu((prevMenu) => !prevMenu)}
//       mode={mode}
//       menu={menu}
//       sorting={sorting}
//     />
//     <Table
//       users={users}
//       table={table}
//       mode={mode}
//       selectUser={selectUser}
//       showUserProfile={props.showUserProfile}
//     />
//     <BottomBar
//       page={page}
//       pages={pages}
//       table={table}
//       setPage={(direction: string) =>
//         direction === "next"
//           ? setPage((previousPage) => previousPage + 1)
//           : setPage((previousPage) => previousPage - 1)
//       }
//       changeMode={changeMode}
//       handleUsersCountChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
//         handleUsersCountChange(e)
//       }
//       handleTableChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
//         handleTableChange(e)
//       }
//     />
//   </div>
// );
