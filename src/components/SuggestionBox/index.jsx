import React from "react";
import Autosuggest from "react-autosuggest";
import config from "../../config";
import api from "../../services/api";
import style from "./style.module.scss";

/**
 * Decides what is displayed after the user selects a suggestion
 * @param {Object} suggestion The selected suggestion
 */
const getSuggestionValue = (suggestion) => suggestion.name;

/**
 * Decides how to render the suggestion in the dropdown
 * @param {Object} suggestion The suggestion
 */
const renderSuggestion = (suggestion) => <span>{suggestion.name}</span>;

/**
 * Returns the suggestions
 * @param {Object} apiClient The api client to make the query
 * @param {String} inputValue The search query
 */
const getSuggestions = async (apiClient, inputValue) => {
  let term = inputValue.trim();
  if (term.length < 1) {
    return [];
  }

  term = encodeURIComponent(term);

  const url = `${config.SEARCH_UI_API_URL}/skills?q=${term}`;

  const { data } = await apiClient.get(url);

  return data.skills;
};

export default function SuggestionBox({ placeholder, onSelect }) {
  const apiClient = api();
  const [suggestions, setSuggestions] = React.useState([]);
  const [value, setValue] = React.useState("");

  const onChange = (event, { newValue }) => setValue(newValue);

  const onSuggestionsFetchRequested = async ({ value }) => {
    const data = await getSuggestions(apiClient, value);

    setSuggestions(data);
  };

  const onSuggestionsClearRequested = () => setSuggestions([]);

  const onSuggestionSelected = (event, { suggestion }) => {
    onSelect(suggestion);
    setValue("");
  };

  const inputProps = {
    placeholder,
    value,
    onChange,
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
    />
  );
}
