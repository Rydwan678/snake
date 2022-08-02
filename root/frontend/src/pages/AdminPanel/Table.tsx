import React, { useEffect, useState } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Checkbox } from "@mui/material";
import { TableVirtuoso } from "react-virtuoso";
import { Remove } from "@mui/icons-material";

export interface User {
  id: number;
  login: string;
  email: string;
  dateOfBirth: string;
  password: string;
  isSelected: boolean;
  role: string;
}

export type Mode = "browse" | "edit";

interface UsersTableProps {
  users: User[];
  selectUser: (e: React.ChangeEvent<HTMLInputElement>, userID: number) => void;
  selectAllUsers: () => void;
}

function UsersTable(props: UsersTableProps) {
  return (
    <TableVirtuoso
      style={{ height: 493.5 }}
      data={props.users}
      components={{
        Scroller: React.forwardRef((props, ref) => (
          <TableContainer {...props} ref={ref} />
        )),
        Table: (props) => (
          <Table
            {...props}
            style={{
              borderCollapse: "separate",
            }}
          />
        ),
        TableHead: TableHead,
        TableRow: TableRow,
        TableBody: React.forwardRef((props, ref) => (
          <TableBody {...props} ref={ref} />
        )),
      }}
      fixedHeaderContent={() => (
        <TableRow sx={{ backgroundColor: "white" }}>
          <TableCell>
            <Checkbox
              sx={{ padding: 0, margin: 0 }}
              size="small"
              defaultChecked={
                props.users.find((user) => user.isSelected === true) !==
                undefined
                  ? true
                  : false
              }
              onChange={props.selectAllUsers}
            />
          </TableCell>

          <TableCell sx={{ width: 50 }}>ID</TableCell>
          <TableCell sx={{ width: 300 }}>Name</TableCell>
          <TableCell sx={{ width: 350 }}>Email</TableCell>
          <TableCell
            sx={{
              width: 50,
              display: { sm: "none", md: "block" },
            }}
          >
            Role
          </TableCell>
        </TableRow>
      )}
      itemContent={(index, user) => (
        <>
          <TableCell>
            <Checkbox
              sx={{ padding: 0, margin: 0 }}
              size="small"
              defaultChecked={user.isSelected}
              onChange={(e) => props.selectUser(e, user.id)}
            />
          </TableCell>

          <TableCell sx={{ width: 50 }}>{user.id}</TableCell>
          <TableCell sx={{ width: 300 }}>{user.login}</TableCell>
          <TableCell sx={{ width: 350 }}>{user.email}</TableCell>
          <TableCell
            sx={{
              width: 50,
              display: { sm: "none", md: "table-cell" },
            }}
          >
            {user.role}
          </TableCell>
        </>
      )}
    />
  );
}

export default UsersTable;
