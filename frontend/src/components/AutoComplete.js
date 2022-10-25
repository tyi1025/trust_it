import React, { Component } from 'react';
import { Form } from 'react-bootstrap';

import '../scss/Autocomplete.scss';

class Autocomplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSuggestion: 0,
      showSuggestions: false,
      userInput: props.defaultValue,
      clicked: false
    };
  }

  onChange = e => {
    const userInput = e.currentTarget.value;

    this.props.onChange && this.props.onChange(userInput);

    this.setState({
      activeSuggestion: 0,
      showSuggestions: true,
      userInput: userInput
    });
  };

  onClick = (e, activeSuggestion) => {
    this.setState({
      activeSuggestion: 0,
      showSuggestions: false,
      userInput: e.currentTarget.innerText
    });
    this.props.onClick(this.props.suggestions[activeSuggestion], activeSuggestion);
  };

  onKeyDown = e => {
    const { activeSuggestion } = this.state;

    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: this.props.suggestions[activeSuggestion].name
      });
      this.props.onClick(this.props.suggestions[activeSuggestion], activeSuggestion);
    } else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }
      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === this.props.suggestions.length) {
        return;
      }
      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  onFocus = e => {
    const userInput = e.currentTarget.value;
    this.setState({showSuggestions: true});
    this.props.onChange && this.props.onChange(userInput);
  };

  onBlur = () => {
    this.setState({showSuggestions: false});
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      onFocus,
      onBlur,
      state: {
        activeSuggestion,
        showSuggestions,
        userInput
      }
    } = this;

    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (this.props.suggestions.length) {
        suggestionsListComponent = (
          <ul className='suggestions'>
            {this.props.suggestions.map((suggestion, index) => {
              let className;

              if (index === activeSuggestion) {
                className = 'suggestion-active';
              }
              return (
                <li
                  className={className}
                  key={suggestion._id}
                  onMouseDown={(e) => onClick(e, index)}>
                  {suggestion.name}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div className='no-suggestions'>
            <em>No suggestions available.</em>
          </div>
        );
      }
    }

    return (
      <div className="autocomplete" key={this.props.defaultValue}>
        <Form.Control
          placeholder={this.props.placeholder}
          type="text"
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          value={userInput} />
        <div className="suggestions-container">
          {suggestionsListComponent}
        </div>
      </div>
    );
  }
}

export default Autocomplete;
