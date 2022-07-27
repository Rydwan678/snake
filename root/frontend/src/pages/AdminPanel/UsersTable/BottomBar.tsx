import React from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

type Direction = "previous" | "next";

interface BottomBarProps {
  page: number;
  pages: number;
  table: string;
  setPage: (direction: string) => void;
  changeMode: () => void;
  handleUsersCountChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleTableChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function BottomBar(props: BottomBarProps) {
  function changePage(direction: Direction) {
    props.setPage(direction);
  }

  const changePageElement = (
    <>
      <div
        className="page-nav--item"
        onClick={props.page > 1 ? () => changePage("previous") : () => {}}
      >
        {props.page > 1 && <IoIosArrowBack className="arrow-icon" />}
      </div>
      <div className="page-nav--item">
        <h2>{props.page}</h2>
      </div>
      <div
        className="page-nav--item"
        onClick={props.page < props.pages ? () => changePage("next") : () => {}}
      >
        {props.page < props.pages && (
          <IoIosArrowForward className="arrow-icon" />
        )}
      </div>
    </>
  );

  return (
    <div className="admin-panel--bottom-bar">
      <div className="bottom-bar--buttons">
        <Link to="/">
          <button>
            <p>BACK</p>
          </button>
        </Link>

        <button onClick={props.changeMode}>
          <p>EDIT</p>
        </button>
      </div>

      <div className="bottom-bar--page-nav">
        {props.table === "pages" && changePageElement}
      </div>
      <div className="bottom-bar--options">
        {props.table === "pages" && (
          <select onChange={(e) => props.handleUsersCountChange(e)}>
            <option value="8">8</option>
            <option value="16">16</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        )}

        <select
          onChange={(e) => props.handleTableChange(e)}
          defaultValue={props.table}
        >
          <option value="pages">Pages</option>
          <option value="virtual">Virtual Table</option>
        </select>
      </div>
    </div>
  );
}
