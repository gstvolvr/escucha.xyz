import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import { artists, genres } from './docs/data';
import { css } from 'emotion';

const components = {
  DropdownIndicator: null,
}
const rawOption = (label: string) => ({
  label: label,
  value: label,
})
const createOption = (label: string) => ({
  label: getUserId(label),
  value: getUserId(label),
})
const colourStyles = {
  control: styles => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = "black";
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected ? data.color : isFocused ? color.alpha(0.1).css() : null,
      color: isDisabled
        ? '#ccc'
        : isSelected
          ? 'black'
          : data.color,
      cursor: isDisabled ? 'not-allowed' : 'default',
    };
  },
  multiValue: (styles, { data }) => {
    const color = "black"
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white',
    },
  }),
};

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px dotted pink',
    color: state.isSelected ? 'red' : 'blue',
    padding: 60,
  }),
  control: () => ({
    // none of react-select's styles are passed to <Control />
    width: 100,
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...provided, opacity, transition };
  }
}

export default class Recommender extends React.Component<*, State> {
  state = {
    inputValle: "",
    value: [],
  }

  handleInputChange = (inputValue: string) => {
    this.setState({inputValue})
  }

  handleChange = (newValue: any, actionMeta: any) => {
    console.group('Value Changed')
    console.log(newValue)
    console.log(`action: ${actionMeta.action}`)
    console.groupEnd()
  }

  handleKeyDown = (event: SyntheticKeyboardEvent<HTMLElement>) => {
    const { inputValue, value } = this.state;
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        console.group('Value Added');
        console.log(value);
        console.groupEnd();
        this.setState({
          inputValue: '',
          value: [...value, createOption(inputValue)],
        })
        event.preventDefault();
    }
  }
  render() {
    const { inputValue, value } = this.state;
    return (
      <div className='recommender'>
        <div className='react-select-container'>
            <CreatableSelect
              components={components}
              inputValue={inputValue}
              isClearable
              isMulti
              menuIsOpen={false}
              onChange={this.handleChange}
              onInputChange={this.handleInputChange}
              onKeyDown={this.handleKeyDown}
              placeholder="Paste a link to one of your Spotify playlists"
              value={value}
            />
        </div>
        <div className='react-select-container'>
            <Select
              isMulti
              defaultInputValue=""
              onChange={this.handleChange}
              defaultValue={[]}
              options={artists}
              placeholder="Or choose some artists you like"
            />
        </div>
        <div className='react-select-container'>
            <Select
              isMulti
              defaultInputValue=""
              onChange={this.handleChange}
              defaultValue={[]}
              options={genres}
              placeholder="What genres are you in the mood for?"
            />
        </div>
      </div>
    )
  }
}

function getUserId(link) {
  if (link != null & link.length > 10 & link.slice(0, 4) == "http") {
    var re = /user\/([^/]+)\/playlist/
    var match = re.exec(link)
    console.log(link)
    console.log(match)
    console.log(match[1])
    if (match != null) return match[1]
  }
  return

}

ReactDOM.render(
  <Recommender />,
  document.getElementById('root')
);
