import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { createProfile, getCurrentProfile } from "../../redux/actions/profiles";

const EditProfile = ({
  profile: { profile, loading, user },
  createProfile,
  getCurrentProfile,
  history
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  useEffect(() => {
    fillInputs();
  }, [profile]);

  const [formData, setFormData] = useState({
    field: "",
    bio: "",
    status: "",
    location: "",
    goal: "",
    hobbies: "",
    interests: "",
    website: "",
    twitter: "",
    facebook: "",
    linkedin: "",
    youtube: "",
    instagram: ""
  });

  const [formErrors, setFormErrors] = useState({
    bioError: "",
    statusError: "",
    locationError: "",
    goalError: "",
    hobbiesError: "",
    interestsError: "",
    websiteError: "",
    twitterError: "",
    facebookError: "",
    linkedinError: "",
    youtubeError: "",
    instagramError: "",
    bioValid: true,
    statusValid: true,
    locationValid: true,
    goalValid: true,
    hobbiesValid: true,
    interestsValid: true,
    websiteValid: true,
    twitterValid: true,
    facebookValid: true,
    linkedinValid: true,
    youtubeValid: true,
    instagramValid: true
  });

  const fillInputs = () => {
    if (profile) {
      setFormData({
        bio: profile.bio,
        status: profile.status,
        location: profile.location,
        goal: profile.goal,
        hobbies: profile.hobbies.join(","),
        interests: profile.interests.join(",")
      });
    }
  };

  const {
    field,
    bio,
    status,
    location,
    website,
    goal,
    hobbies,
    interests,
    twitter,
    facebook,
    linkedin,
    youtube,
    instagram
  } = formData;

  const {
    bioError,
    statusError,
    locationError,
    goalError,
    hobbiesError,
    interestsError,
    websiteError,
    twitterError,
    facebookError,
    linkedinError,
    youtubeError,
    instagramError,
    bioValid,
    statusValid,
    locationValid,
    goalValid,
    hobbiesValid,
    interestsValid,
    websiteValid,
    twitterValid,
    facebookValid,
    linkedinValid,
    youtubeValid,
    instagramValid
  } = formErrors;

  const [displaySocialInputs, toggleSocialInputs] = useState(false);

  useEffect(() => {
    validateForm(field);
  }, [formData]);

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    createProfile(formData, history, true);
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
          Edit Profile
        </button>
      </div>
    </form>
  );
};

EditProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profiles
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
  withRouter(EditProfile)
);
