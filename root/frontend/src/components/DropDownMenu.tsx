import React from "react";
import { BsFillTrashFill } from "react-icons/bs";

interface DropDownMenuProps {
  menu: boolean;
  deleteUsers: () => void;
}

export default function DropDownMenu(props: DropDownMenuProps) {
  return (
    <div className="dropdown-menu">
      <div className="dropdown-menu--item" onClick={props.deleteUsers}>
        <BsFillTrashFill className="trash-icon" />
        <p>DELETE</p>
      </div>
      <div className="dropdown-menu--item">
        <p>TEST</p>
      </div>
    </div>
  );
}
