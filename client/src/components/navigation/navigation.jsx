import React from "react";
import { Link } from "react-router-dom";
import sprite from "../../assets/img/sprite.svg";

const Navigation = () => {
  return (
    <nav className="sidebar">
      <ul className="side-nav">
        <li className="side-nav__item side-nav__item">
          <Link to="/posts" className="side-nav__link">
            <svg className="side-nav__icon">
              <use xlinkHref={`${sprite}#icon-paper-plane`}></use>
            </svg>
            <span>Posts</span>
          </Link>
        </li>
        <li className="side-nav__item">
          <Link to="/profiles" className="side-nav__link">
            <svg className="side-nav__icon">
              <use xlinkHref={`${sprite}#icon-users`}></use>
            </svg>
            <span>Members</span>
          </Link>
        </li>
        <li className="side-nav__item">
          <Link to="/groups" className="side-nav__link">
            <svg className="side-nav__icon">
              <use xlinkHref={`${sprite}#icon-mask`}></use>
            </svg>
            <span>Groups</span>
          </Link>
        </li>
      </ul>
      <div className="legal">&copy; 2019 by Trillo. All rights reserved.</div>
    </nav>
  );
};

export default Navigation;
