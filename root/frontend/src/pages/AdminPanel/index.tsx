import React, { useState, useEffect } from "react";
import TopBar from "./TopBar";
import UsersTable from "./Table";
import BottomBar from "./BottomBar";
import {
  createTheme,
  Grid,
  SelectChangeEvent,
  ThemeProvider,
  Paper,
  CircularProgress,
} from "@mui/material";
import { User, TableType, Alert } from "../../types";
import DeleteAlert from "./DeleteAlert";
import SnackbarAlert from "../../components/SnackbarAlert";

function AdminPanel() {
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
  const [alert, setAlert] = useState<Alert>({
    open: false,
    type: "info",
    message: "",
  });
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSelectedUsers(() => {
      const selectedUsersArray: number[] = [];
      users.forEach((user) =>
        user.isSelected ? selectedUsersArray.push(user.id) : () => {}
      );
      return selectedUsersArray;
    });
  }, [users]);

  useEffect(() => {
    getUsers();
  }, [page, sorting, searchBar, table, usersCount]);

  const theme = createTheme({
    typography: {
      fontFamily: "Ubuntu",
    },
  });

  async function getUsers() {
    try {
      const response = await fetch("http://127.0.0.1:8080/users", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization: `Beaer ${localStorage.getItem("token")}`,
          params: JSON.stringify({
            page,
            sorting,
            searchBar,
            usersCount,
            table,
          }),
        },
      });
      const data = await response.json();

      setPages(data.pages);

      let updatedUsers: User[] = [];
      console.log("users", data);

      data.users.forEach((user: User) =>
        updatedUsers.push({
          ...user,
          isSelected: false,
        })
      );

      setUsers(updatedUsers);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  }

  async function deleteUsers() {
    try {
      const response = await fetch(
        `http://127.0.0.1:8080/users/${selectedUsers.toString()}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            authorization: `Beaer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setAlert({
        open: true,
        type: "success",
        message: `You successfully deleted ${selectedUsers.length} user${
          selectedUsers.length > 1 ? "s" : ""
        }`,
      });
      getUsers();
    } catch (error) {
      console.log("error", error);
    }
  }

  function confirmDelete() {
    if (selectedUsers.length < 1) {
      setAlert({
        open: true,
        type: "error",
        message: "You haven't selected any users",
      });
      return;
    } else {
      setDeleteAlert(true);
    }
  }

  function changeTable(e: SelectChangeEvent) {
    e.target.value === "pages" ? setTable("pages") : setTable("virtual");
  }

  function changePage(way: string) {
    if (way === "next") {
      setPage((previousPage) => previousPage + 1);
    } else if (way === "previous") {
      setPage((previousPage) => previousPage - 1);
    }
  }

  function search(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setSearchBar(e.target.value);
  }

  function selectUser(e: React.ChangeEvent<HTMLInputElement>, userID: number) {
    setUsers((previousUsers) => {
      return previousUsers.map((user) => ({
        ...user,
        isSelected: user.id === userID ? e.target.checked : user.isSelected,
      }));
    });
  }

  function selectAllUsers() {
    if (users.find((user) => user.isSelected === true) === undefined) {
      setUsers((previousUsers) => {
        return previousUsers.map((user) => ({
          ...user,
          isSelected: true,
        }));
      });
    } else {
      setUsers((previousUsers) => {
        return previousUsers.map((user) => ({
          ...user,
          isSelected: false,
        }));
      });
    }
  }

  function closeSnackBar() {
    setAlert((previousAlert) => ({
      ...previousAlert,
      open: false,
    }));
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid sx={{ width: { sm: 700, md: 750 } }} component={Paper}>
        <SnackbarAlert alert={alert} close={closeSnackBar} />
        <DeleteAlert
          open={deleteAlert}
          close={() => setDeleteAlert(false)}
          selectedUsersCount={selectedUsers.length}
          deleteUsers={deleteUsers}
        />

        <TopBar search={search} confirmDelete={confirmDelete} />
        <UsersTable
          users={users}
          selectUser={selectUser}
          selectAllUsers={selectAllUsers}
        />
        {loading && (
          <CircularProgress
            sx={{ position: "absolute", left: "50%", top: "50%" }}
          />
        )}
        <BottomBar
          changeTable={changeTable}
          changePage={changePage}
          page={page}
          pages={pages}
          table={table}
        />
      </Grid>
    </ThemeProvider>
  );
}

export default AdminPanel;
