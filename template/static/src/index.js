import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import { artists, genres } from './docs/data';

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
const themes = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#FFB9D6',
    primary: "#484848",
    primary50: "black",
    neutral90: "black",
    neutral80: "black", // text color once chosen
    neutral50: "#484848", // placeholder color
    neutral20: "#DCDCDC", // border and features
    neutral30: "#FEFEFE", // border during hover
    neutral40: "#484848", // features during hover and text when empty
    neutral10: "#FFB9D6",
    neutral5: "#DCDCDC",
    neutral0: "#FEFEFE", // background color
    dangerLight: null,
  }
})

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
              theme={themes}
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
              theme={themes}
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
              theme={themes}
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
