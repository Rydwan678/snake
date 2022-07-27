import React from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { IoSearchSharp } from "react-icons/io5";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import DropDownMenu from "../../../components/DropDownMenu";
import { Sorting, Mode } from "../../../types";

interface TopBarProps {
  setSearchBar: (text: string) => void;
  changeSorting: (orderBy: string) => void;
  deleteUsers: () => void;
  setMenu: () => void;
  mode: Mode;
  menu: boolean;
  sorting: Sorting;
}

export default function TopBar(props: TopBarProps) {
  function search(e: React.ChangeEvent<HTMLInputElement>) {
    props.setSearchBar(e.target.value);
  }

  return (
    <div className="admin-panel--top-bar">
      <div className="headers">
        <div className="headers--menu">
          {props.mode === "edit" && (
            <BiDotsVerticalRounded
              className="dots-menu"
              onClick={props.setMenu}
            />
          )}

          {props.menu && (
            <DropDownMenu menu={props.menu} deleteUsers={props.deleteUsers} />
          )}
        </div>

        <div className="headers--id" onClick={() => props.changeSorting("id")}>
          <p>ID</p>
          {props.sorting.orderBy === "id" &&
            (props.sorting.mode === "ASC" ? (
              <IoIosArrowUp />
            ) : (
              <IoIosArrowDown />
            ))}
        </div>
        <div
          className="headers--name"
          onClick={() => props.changeSorting("name")}
        >
          <p>NAME</p>
          {props.sorting.orderBy === "name" &&
            (props.sorting.mode === "ASC" ? (
              <IoIosArrowUp />
            ) : (
              <IoIosArrowDown />
            ))}
        </div>
        <div
          className="headers--email"
          onClick={() => props.changeSorting("email")}
        >
          <p>EMAIL</p>
          {props.sorting.orderBy === "email" &&
            (props.sorting.mode === "ASC" ? (
              <IoIosArrowUp />
            ) : (
              <IoIosArrowDown />
            ))}
        </div>
        <div className="headers--search-bar">
          <IoSearchSharp className="loupe-icon" />
          <input className="search-bar" onChange={(e) => search(e)}></input>
        </div>
      </div>
    </div>
  );
}
