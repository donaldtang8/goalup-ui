import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { createProfile } from "../../redux/actions/profiles";
import PropTypes from "prop-types";

const CreateProfile = ({ auth, createProfile, history }) => {
  const [formData, setFormData] = useState({
    field: "",
    bio: "",
    goal: "",
    status: "",
    location: "",
    hobbies: "",
    interests: "",
    website: ""
  });

  const [formErrors, setFormErrors] = useState({
    bioError: "",
    goalError: "",
    statusError: "",
    locationError: "",
    hobbiesError: "",
    interestsError: "",
    websiteError: "",
    bioValid: false,
    goalValid: false,
    statusValid: false,
    locationValid: false,
    hobbiesValid: false,
    interestsValid: false,
    websiteValid: false
  });

  const {
    field,
    bio,
    goal,
    status,
    location,
    hobbies,
    interests,
    website
  } = formData;

  const {
    bioError,
    goalError,
    statusError,
    locationError,
    hobbiesError,
    interestsError,
    bioValid,
    goalValid,
    statusValid,
    locationValid,
    hobbiesValid,
    interestsValid
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
    createProfile(formData, history);
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
      case "bio":
        setFormErrors({
          ...formErrors,
          bioError: checkError("bio", bio, 5),
          bioValid: checkValid(bio, 5)
        });
        break;
      case "goal":
        setFormErrors({
          ...formErrors,
          goalError: checkError("goal", goal, 3),
          goalValid: checkValid(goal, 3)
        });
        break;
      case "status":
        setFormErrors({
          ...formErrors,
          statusError: checkError("status", status, 3),
          statusValid: checkValid(status, 3)
        });
        break;
      case "location":
        setFormErrors({
          ...formErrors,
          locationError: checkError("location", location, 3),
          locationValid: checkValid(location, 3)
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
            bioValid
              ? "form__input form__input--valid"
              : "form__input form__input--invalid"
          }
          id="bio"
          placeholder="Write a short bio"
          name="bio"
          value={bio}
          onChange={e => onChange(e)}
          maxLength="30"
          required
        />
        <label htmlFor="bio" className="form__label">
          Write a short bio
        </label>
        {bioError.length > 0 && (
          <div className="form__group--error">{bioError}</div>
        )}
      </div>

      <div className="form__group">
        <input
          type="text"
          className={
            goalValid
              ? "form__input form__input--valid"
              : "form__input form__input--invalid"
          }
          id="goal"
          placeholder="What is your current goal?"
          name="goal"
          value={goal}
          onChange={e => onChange(e)}
          required
        />
        <label htmlFor="goal" className="form__label">
          What is your current goal?
        </label>
        {goalError.length > 0 && (
          <div className="form__group--error">{goalError}</div>
        )}
      </div>

      <div className="form__group">
        <input
          type="text"
          className={
            statusValid
              ? "form__input form__input--valid"
              : "form__input form__input--invalid"
          }
          id="status"
          placeholder="What is the current status of your goal?"
          name="status"
          value={status}
          onChange={e => onChange(e)}
          required
        />
        <label htmlFor="status" className="form__label">
          What is the current status of your goal?
        </label>
        {statusError.length > 0 && (
          <div className="form__group--error">{statusError}</div>
        )}
      </div>

      <div className="form__group">
        <input
          type="text"
          className={
            locationValid
              ? "form__input form__input--valid"
              : "form__input form__input--invalid"
          }
          id="location"
          placeholder="Location"
          name="location"
          value={location}
          onChange={e => onChange(e)}
          required
        />
        <label htmlFor="location" className="form__label">
          Location
        </label>
        {locationError.length > 0 && (
          <div className="form__group--error">{locationError}</div>
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
          placeholder="Your hobbies"
          name="hobbies"
          value={hobbies}
          onChange={e => onChange(e)}
          required
        />
        <label htmlFor="hobbies" className="form__label">
          Your hobbies (Comma separated values)
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
          placeholder="Your interests"
          name="interests"
          value={interests}
          onChange={e => onChange(e)}
          required
        />
        <label htmlFor="interests" className="form__label">
          Your interests (Comma separated values)
        </label>
        {interestsError.length > 0 && (
          <div className="form__group--error">{interestsError}</div>
        )}
      </div>

      <div className="form__group--submit">
        <button
          className={
            !bioValid ||
            !goalValid ||
            !statusValid ||
            !locationValid ||
            !hobbiesValid ||
            !interestsValid
              ? "btn btn--error"
              : "btn btn--primary"
          }
        >
          Create Profile
        </button>
      </div>
    </form>
  );
};

CreateProfile.propTypes = {
  createProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { createProfile })(
  withRouter(CreateProfile)
);
