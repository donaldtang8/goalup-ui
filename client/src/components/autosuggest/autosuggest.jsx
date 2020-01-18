import React, { useState, useEffect } from "react";

import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getProfiles } from "../../redux/actions/profiles";
import { getGroups } from "../../redux/actions/groups";
import PropTypes from "prop-types";

import Autosuggest from "react-autosuggest";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";
import _ from "lodash";

const AutosuggestSearch = ({ getProfiles, getGroups, profiles, groups }) => {
  useEffect(() => {
    getProfiles();
    getGroups();
  }, [getProfiles, getGroups]);
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [noSuggestions, setNoSuggestions] = useState(false);

  const escapeRegexCharacters = str => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const createSuggestionObject = (
    type,
    id,
    name,
    username,
    description,
    img,
    date
  ) => {
    const suggestionObject = {
      type: type,
      id: id,
      name: name,
      username: username,
      description: description,
      img: img,
      date: date
    };
    return suggestionObject;
  };

  const getSuggestions = value => {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === "") {
      return [];
    }

    const regex = new RegExp("^" + escapedValue, "i");
    let res = [];

    // profileRes will now contain all the profile objects that match regex
    let profileRes = profiles.filter(profile => regex.test(profile.user.name));
    let groupRes = groups.filter(group => regex.test(group.name));
    if (profileRes.length > 0) {
      profileRes.forEach(profile =>
        res.push(
          createSuggestionObject(
            "profile",
            profile.user._id,
            profile.user.name,
            profile.user.username,
            null,
            profile.user.avatar,
            profile.date
          )
        )
      );
    }
    if (groupRes.length > 0) {
      groupRes.forEach(group =>
        res.push(
          createSuggestionObject(
            "group",
            group._id,
            group.name,
            null,
            group.description,
            group.creator.avatar,
            group.date
          )
        )
      );
    }
    return res;
  };

  const getSuggestionValue = suggestion => {
    return suggestion.name;
  };

  const renderSuggestion = (suggestion, { query }) => {
    const matches = AutosuggestHighlightMatch(suggestion.name, query);
    const parts = AutosuggestHighlightParse(suggestion.name, matches);
    return (
      <Link
        to={
          suggestion.type === "profile"
            ? `/profiles/${suggestion.id}`
            : `/groups/${suggestion.id}`
        }
      >
        <div className="suggestion-content">
          <div className="suggestion-content--header">
            <img
              src={suggestion.img}
              alt={suggestion.name}
              className="suggestion-content--img"
            />
          </div>
          <div className="suggestion-content--body">
            <div className="suggestion-content--result">
              {parts.map((part, index) => {
                const className = part.highlight ? "highlight" : null;

                return (
                  <span className={className} key={index}>
                    {part.text}
                  </span>
                );
              })}
            </div>
            {suggestion.username && (
              <div className="suggestion-content--result">{`@${suggestion.username}`}</div>
            )}
            {suggestion.description && (
              <div className="suggestion-content--result">
                {_.truncate(suggestion.description, {
                  length: 24,
                  separator: " "
                })}
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  };

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  const onSuggestionsFetchRequested = ({ value }) => {
    const sug = getSuggestions(value);
    const noSug = sug.length === 0;
    setSuggestions(sug);
    setNoSuggestions(noSug);
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  // Autosuggest will pass through all these props to the input.
  const inputProps = {
    placeholder: "Search",
    value,
    onChange: onChange
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
    />
  );
};

AutosuggestSearch.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  getGroups: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profiles: state.profiles.profiles,
  groups: state.groups.groups
});

export default connect(mapStateToProps, { getProfiles, getGroups })(
  AutosuggestSearch
);
