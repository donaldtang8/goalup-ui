import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import {
  loadUser,
  login,
  logout,
  toggleDropdown
} from "../../redux/actions/auth";

import PropTypes from "prop-types";

import { getUserNotifications } from "../../redux/actions/notifications";

import AutosuggestSearch from "../autosuggest/autosuggest";

import logo from "../../assets/img/logo.png";
import sprite from "../../assets/img/sprite.svg";

const Header = ({
  auth: { isAuthenticated, user, showUserDropdown, loading, errors },
  notifications: { notifications },
  getUserNotifications,
  loadUser,
  login,
  logout,
  toggleDropdown,
  history
}) => {
  useEffect(() => {
    getUserNotifications();
    loadUser();
  }, [getUserNotifications, loadUser]);

  const [userCredentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const [showNotifications, setShowNotifications] = useState(false);

  const { email, password } = userCredentials;

  const handleSubmit = async e => {
    e.preventDefault();
    // sign in action
    login(email, password, history);
  };

  const handleChange = e => {
    const { value, name } = e.target;
    setCredentials({ ...userCredentials, [name]: value });
  };

  return isAuthenticated && user ? (
    <header className="header">
      <Link to="/">
        <img src={logo} alt="Trillo Logo" className="logo" />
      </Link>
      {/* <form className="search">
        <input type="text" className="search__input" placeholder="Search" />
        <button className="search__button">
          <svg className="search__icon">
            <use xlinkHref={`${sprite}#icon-magnifying-glass`}></use>
          </svg>
        </button>
      </form> */}
      <AutosuggestSearch />

      <nav className="user-nav">
        <Link to="/" className="user-nav__icon-box">
          <svg className="user-nav__icon">
            <use xlinkHref={`${sprite}#icon-home`}></use>
          </svg>
        </Link>
        <Link to="/friends" className="user-nav__icon-box">
          <svg className="user-nav__icon">
            <use xlinkHref={`${sprite}#icon-users`}></use>
          </svg>
          {user && user.friend_received_requests.length > 0 && (
            <span className="user-nav__notification">
              {user.friend_received_requests.length}
            </span>
          )}
        </Link>
        <div
          className="user-nav__icon-box"
          onClick={() => alert("Feature coming soon")}
        >
          <svg className="user-nav__icon">
            <use xlinkHref={`${sprite}#icon-message`}></use>
          </svg>
          {/* <span className="user-nav__notification">0</span> */}
        </div>
        <Link
          to="/notifications"
          className="user-nav__icon-box"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <svg className="user-nav__icon">
            <use xlinkHref={`${sprite}#icon-bookmark`}></use>
          </svg>
          {notifications && notifications.length > 0 && (
            <span className="user-nav__notification">
              {notifications.length}
            </span>
          )}
        </Link>
        <div className="user-nav__user" onClick={() => toggleDropdown()}>
          <img
            src={user.avatar}
            alt={user.name}
            className="user-nav__user-photo"
          />
          <span className="user-nav__user-name">{user.name}</span>
        </div>
      </nav>

      <div
        className={
          showUserDropdown
            ? "user-nav__dropdown user-nav__dropdown--user"
            : "user-nav__dropdown user-nav__dropdown--user user-nav__dropdown--hidden"
        }
      >
        <ul>
          {!loading && user && (
            <Link to={`/profiles/${user._id}`}>
              <li
                className="user-nav__dropdown--item"
                onClick={() => toggleDropdown()}
              >
                <span>Profile</span>
              </li>
            </Link>
          )}
          <Link to="/" onClick={logout}>
            <li
              className="user-nav__dropdown--item"
              onClick={() => toggleDropdown()}
            >
              <span>Logout</span>
            </li>
          </Link>
        </ul>
      </div>
    </header>
  ) : (
    <header className="header">
      <Link to="/">
        <img src={logo} alt="Trillo Logo" className="logo" />
      </Link>

      <nav className="splash-nav">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form__group">
            <input
              type="text"
              className="form__input"
              placeholder="Email"
              name="email"
              id="email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form__group">
            <input
              type="password"
              className="form__input"
              placeholder="Password"
              name="password"
              id="password"
              value={password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form__group--submit">
            <input
              type="submit"
              className="btn-small btn-small--primary"
              value="Login"
            />
          </div>
        </form>
      </nav>
    </header>
  );
};

Header.propTypes = {
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  toggleDropdown: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  notifications: state.notifications
});

export default connect(mapStateToProps, {
  getUserNotifications,
  loadUser,
  login,
  logout,
  toggleDropdown
})(withRouter(Header));
