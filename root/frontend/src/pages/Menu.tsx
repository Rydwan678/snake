import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Menu() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token === null || token === "null") {
      navigate("/login", { replace: true });
    }
  }, []);

  return (
    <div className="Menu">
      <div className="menu">
        <Link to="/play">
          <button>
            <p>START</p>
          </button>
        </Link>
        <Link to="/options" className="button">
          <button>
            <p>OPTIONS</p>
          </button>
        </Link>
        <Link to="/userPanel" className="button">
          <button>
            <p>PROFILE</p>
          </button>
        </Link>
        <Link to="/about" className="button">
          <button>
            <p>ABOUT</p>
          </button>
        </Link>
      </div>
    </div>
  );
}
