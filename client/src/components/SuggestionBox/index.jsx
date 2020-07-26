import React from "react";
import Autosuggest from "react-autosuggest";
import config from "../../config";
import api from "../../services/api";
import style from "./style.module.scss";

const NO_RESULTS_FOUND = "no results found";

/**
 * Decides what is displayed after the user selects a suggestion
 * @param {Object} suggestion The selected suggestion
 */
const getSuggestionValue = (suggestion) =>
  suggestion.name ? suggestion.name : suggestion.value;

/**
 * Decides how to render the suggestion in the dropdown
 * @param {Object} suggestion The suggestion
 */
const renderSuggestion = (suggestion) => (
  <span>{suggestion.name ? suggestion.name : suggestion.value}</span>
);

/**
 * Styles the input field for the suggestion input
 * @param {Object} inputProps The input props
 * @param {Function} reset resets the input
 */
const renderInputComponent = (inputProps, reset) => (
  <div className={style.searchbox}>
    <i className={style.searchboxIcon}></i>
    <input {...inputProps} />
    <span
      className={
        inputProps.value.length > 0
          ? `${style.resetKeyword}`
          : `${style.resetKeyword} ${style.resetKeywordHidden}`
      }
      onClick={() => reset()}
    >
      &times;
    </span>
  </div>
);

/**
 * Returns the suggestions for skills
 * @param {Object} apiClient The api client to make the query
 * @param {String} inputValue The search query
 */
const getSkillsSuggestions = async (apiClient, inputValue) => {
  let term = inputValue.trim();
  if (term.length < 1) {
    return [];
  }

  term = encodeURIComponent(term);

  const url = `${config.API_PREFIX}/skills?q=${term}`;

  const { data } = await apiClient.get(url);

  return data.skills;
};

/**
 * Returns the suggestions for company attributes
 * @param {Object} apiClient The api client to make the query
 * @param {String} inputValue The search query
 */
const getCompanyAttributesSuggestions = async (
  apiClient,
  inputValue,
  attrId
) => {
  let term = inputValue.trim();
  if (term.length < 1) {
    return [];
  }

  term = encodeURIComponent(term);

  const url = `${config.API_URL}/search/userAttributes?attributeId=${attrId}&attributeValue=${term}`;

  const { data } = await apiClient.get(url);

  return data;
};

export default function SuggestionBox({
  purpose,
  companyAttrId,
  placeholder,
  onSelect,
}) {
  const apiClient = api();
  const [suggestions, setSuggestions] = React.useState([]);
  const [value, setValue] = React.useState("");

  const onChange = (event, { newValue }) => setValue(newValue.trim());

  const onSuggestionsFetchRequested = async ({ value }) => {
    if (purpose === "skills") {
      let data = await getSkillsSuggestions(apiClient, value);
      if (data.length < 1) data = [{ name: NO_RESULTS_FOUND }];
      setSuggestions(data);
    } else {
      let data = await getCompanyAttributesSuggestions(
        apiClient,
        value,
        companyAttrId
      );
      if (data.length < 1) data = [{ name: NO_RESULTS_FOUND }];
      setSuggestions(data);
    }
  };

  const onSuggestionsClearRequested = () => setSuggestions([]);

  const onSuggestionSelected = (event, { suggestion }) => {
    if (purpose === "skills") {
      if (suggestion.name !== NO_RESULTS_FOUND) onSelect(suggestion);
    } else {
      if (suggestion.name !== NO_RESULTS_FOUND)
        onSelect(companyAttrId, suggestion);
    }
    setValue("");
  };

  const inputProps = {
    placeholder,
    value,
    onChange,
  };

  const reset = () => {
    setValue("");
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      onSuggestionSelected={onSuggestionSelected}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
      theme={style}
      renderInputComponent={(inputProps) =>
        renderInputComponent(inputProps, reset)
      }
    />
  );
}
