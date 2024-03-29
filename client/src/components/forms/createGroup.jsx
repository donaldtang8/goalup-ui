import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createGroup } from "../../redux/actions/groups";

const CreateGroup = ({ createGroup, history }) => {
  const [formData, setFormData] = useState({
    field: "",
    name: "",
    description: "",
    hobbies: "",
    interests: ""
  });

  const [formErrors, setFormErrors] = useState({
    nameError: "",
    descriptionError: "",
    hobbiesError: "",
    interestsError: "",
    nameValid: false,
    descriptionValid: false,
    hobbiesValid: false,
    interestsValid: false
  });

  const { field, name, description, hobbies, interests } = formData;

  const {
    nameError,
    descriptionError,
    hobbiesError,
    interestsError,
    nameValid,
    descriptionValid,
    hobbiesValid,
    interestsValid
  } = formErrors;

  useEffect(() => {
    validateForm(field);
  }, [formData]);

  const onChange = e =>
    setFormData({
      ...formData,
      field: e.target.name,
      [e.target.name]: e.target.value
    });

  const onSubmit = e => {
    e.preventDefault();
    createGroup(formData, history);
  };

  const checkError = (field, str, length) => {
    const error =
      str.length >= length
        ? ""
        : `${field} must contain at least ${length} characters`;
    return error;
  };

  const checkValid = (str, length) => {
    const valid = str.length >= length ? true : false;
    return valid;
  };

  const validateForm = field => {
    switch (field) {
      case "name":
        setFormErrors({
          ...formErrors,
          nameError: checkError("name", name, 1),
          nameValid: checkValid(name, 1)
        });
        break;
      case "description":
        setFormErrors({
          ...formErrors,
          descriptionError: checkError("description", description, 1),
          descriptionValid: checkValid(description, 1)
        });
        break;
      case "hobbies":
        setFormErrors({
          ...formErrors,
          hobbiesError: checkError("hobbies", hobbies, 3),
          hobbiesValid: checkValid(hobbies, 3)
        });
        break;
      case "interests":
        setFormErrors({
          ...formErrors,
          interestsError: checkError("interests", interests, 3),
          interestsValid: checkValid(interests, 3)
        });
        break;
      default:
        break;
    }
  };

  return (
    <form className="forms-container__form" onSubmit={e => onSubmit(e)}>
      <div className="form__group">
        <input
          type="text"
          className={
            nameValid
              ? "form__input form__input--valid"
              : "form__input form__input--invalid"
          }
          id="name"
          placeholder="Name of Group"
          name="name"
          value={name}
          onChange={e => onChange(e)}
          required
        />
        <label htmlFor="name" className="form__label">
          Name of group
        </label>
        {nameError.length > 0 && (
          <div className="form__group--error">{nameError}</div>
        )}
      </div>

      <div className="form__group">
        <input
          type="text"
          className={
            descriptionValid
              ? "form__input form__input--valid"
              : "form__input form__input--invalid"
          }
          id="description"
          placeholder="Description"
          name="description"
          value={description}
          onChange={e => onChange(e)}
          required
        />
        <label htmlFor="description" className="form__label">
          Description
        </label>
        {descriptionError.length > 0 && (
          <div className="form__group--error">{descriptionError}</div>
        )}
      </div>

      <div className="form__group">
        <input
          type="text"
          className={
            hobbiesValid
              ? "form__input form__input--valid"
              : "form__input form__input--invalid"
          }
          id="hobbies"
          placeholder="Hobbies this group will focus on"
          name="hobbies"
          value={hobbies}
          onChange={e => onChange(e)}
          required
        />
        <label htmlFor="hobbies" className="form__label">
          List some hobbies (comma separated values)
        </label>
        {hobbiesError.length > 0 && (
          <div className="form__group--error">{hobbiesError}</div>
        )}
      </div>

      <div className="form__group">
        <input
          type="text"
          className={
            interestsValid
              ? "form__input form__input--valid"
              : "form__input form__input--invalid"
          }
          id="interests"
          placeholder="interests this group tracks"
          name="interests"
          value={interests}
          onChange={e => onChange(e)}
          required
        />
        <label htmlFor="interests" className="form__label">
          List some interests (comma separated values)
        </label>
        {interestsError.length > 0 && (
          <div className="form__group--error">{interestsError}</div>
        )}
      </div>

      <div className="form__group--submit">
        <button
          className={
            !nameValid || !descriptionValid || !hobbiesValid || !interestsValid
              ? "btn btn--error"
              : "btn btn--primary"
          }
        >
          Create Group
        </button>
      </div>
    </form>
  );
};

CreateGroup.propTypes = {
  createGroup: PropTypes.func.isRequired
};

export default connect(null, { createGroup })(withRouter(CreateGroup));
