import React, { useState, useEffect } from "react";

import { connect } from "react-redux";
import { register } from "../../redux/actions/auth";

import PropTypes from "prop-types";

const SignUp = ({ auth, register, history }) => {
  const [formData, setFormData] = useState({
    field: "",
    name: "",
    username: "",
    email: "",
    password: "",
    password2: ""
  });

  const [formErrors, setFormErrors] = useState({
    nameError: "",
    usernameError: "",
    emailError: "",
    passwordError: "",
    password2Error: "",
    nameValid: false,
    usernameValid: false,
    emailValid: false,
    passwordValid: false,
    password2Valid: false
  });

  let { field, name, username, email, password, password2 } = formData;

  const {
    nameError,
    usernameError,
    emailError,
    passwordError,
    password2Error,
    nameValid,
    usernameValid,
    emailValid,
    passwordValid,
    password2Valid
  } = formErrors;

  useEffect(() => {
    validateForm(field);
  }, [formData]);

  const onChange = e => {
    setFormData({
      ...formData,
      field: e.target.name,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = e => {
    e.preventDefault();
    register({ name, username, email, password, history });
  };

  const checkEmail = email => {
    const errors = {
      error: email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
        ? ""
        : "Email must be valid",
      isValid: email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
        ? true
        : false
    };
    return errors;
  };

  const checkPassword = (field, password, password2, length) => {
    const lengthErr =
      password.length >= length || password2.length >= length
        ? ""
        : `Password must be at least ${length} characters long`;

    const lengthValid =
      password.length >= length || password2.length >= length ? true : false;

    const err =
      (password.length >= length || password2.length >= length) &&
      password !== password2
        ? "Passwords must match"
        : lengthErr;

    const valid =
      (password.length >= length || password2.length >= length) &&
      password !== password2
        ? false
        : lengthValid;

    const errors = {
      error: err,
      isValid: valid
    };

    return errors;
  };

  const checkField = (field, str, length) => {
    const errors = {
      error:
        str.length >= length
          ? ""
          : `${field} must contain at least ${length} characters`,
      isValid: str.length >= length ? true : false
    };
    return errors;
  };

  const validateForm = field => {
    switch (field) {
      case "name":
        setFormErrors({
          ...formErrors,
          nameError: checkField("name", name, 2).error,
          nameValid: checkField("name", name, 2).isValid
        });
        break;
      case "username":
        setFormErrors({
          ...formErrors,
          usernameError: checkField("username", username, 3).error,
          usernameValid: checkField("username", username, 3).isValid
        });
        break;
      case "email":
        setFormErrors({
          ...formErrors,
          emailError: checkEmail(email).error,
          emailValid: checkEmail(email).isValid
        });
        break;
      case "password":
        setFormErrors({
          ...formErrors,
          passwordError: checkPassword("password", password, password2, 6)
            .error,
          passwordValid: checkPassword("password", password, password2, 6)
            .isValid,
          password2Error: checkPassword("password2", password, password2, 6)
            .error,
          password2Valid: checkPassword("password2", password, password2, 6)
            .isValid
        });
        break;
      case "password2":
        setFormErrors({
          ...formErrors,
          passwordError: checkPassword("password", password, password2, 6)
            .error,
          passwordValid: checkPassword("password", password, password2, 6)
            .isValid,
          password2Error: checkPassword("password2", password, password2, 6)
            .error,
          password2Valid: checkPassword("password2", password, password2, 6)
            .isValid
        });
        break;
      default:
        break;
    }
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="u-center-text">
        <div className="heading-tertiary">Get started with goal up</div>
        <div className="form__errors">
          {auth.errors.map((error, index) => (
            <div key={index} className="form__errors--item">
              {error.msg}
            </div>
          ))}
        </div>
      </div>
      <div className="form__group">
        <input
          type="text"
          className={
            nameValid
              ? "form__input form__input--valid"
              : "form__input form__input--invalid"
          }
          id="name"
          placeholder="Full Name"
          name="name"
          value={name}
          onChange={e => onChange(e)}
          required
        />
        <label htmlFor="name" className="form__label">
          Full Name
        </label>
        {nameError.length > 0 && (
          <div className="form__group--error">{nameError}</div>
        )}
      </div>

      <div className="form__group">
        <input
          type="text"
          className={
            usernameValid
              ? "form__input form__input--valid"
              : "form__input form__input--invalid"
          }
          id="username"
          placeholder="Username"
          name="username"
          value={username}
          onChange={e => onChange(e)}
          required
        />
        <label htmlFor="username" className="form__label">
          Username
        </label>
        {usernameError.length > 0 && (
          <div className="form__group--error">{usernameError}</div>
        )}
      </div>

      <div className="form__group">
        <input
          type="text"
          className={
            emailValid
              ? "form__input form__input--valid"
              : "form__input form__input--invalid"
          }
          id="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={e => onChange(e)}
          required
        />
        <label htmlFor="email" className="form__label">
          Email
        </label>
        {emailError.length > 0 && (
          <div className="form__group--error">{emailError}</div>
        )}
      </div>

      <div className="form__group">
        <input
          type="password"
          className={
            passwordValid
              ? "form__input form__input--valid"
              : "form__input form__input--invalid"
          }
          id="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={e => onChange(e)}
          required
        />
        <label htmlFor="password" className="form__label">
          Password
        </label>
        {passwordError.length > 0 && (
          <div className="form__group--error">{passwordError}</div>
        )}
      </div>

      <div className="form__group">
        <input
          type="password"
          className={
            password2Valid
              ? "form__input form__input--valid"
              : "form__input form__input--invalid"
          }
          id="password2"
          placeholder="Confirm Password"
          name="password2"
          value={password2}
          onChange={e => onChange(e)}
          required
        />
        <label htmlFor="password2" className="form__label">
          Confirm Password
        </label>
        {password2Error.length > 0 && (
          <div className="form__group--error">{password2Error}</div>
        )}
      </div>

      <div className="form__group--submit">
        <button
          className={
            !nameValid ||
            !usernameValid ||
            !emailValid ||
            !passwordValid ||
            !password2Valid
              ? "btn btn--error"
              : "btn btn--primary"
          }
          onClick={e => onSubmit(e)}
        >
          Sign Up
        </button>
      </div>
    </form>
  );
};

SignUp.propTypes = {
  history: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { register })(SignUp);
