import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import { artists } from './docs/data';

const components = {
  DropdownIndicator: null,
}
const createOption = (label: string) => ({
  label: getUserId(label),
  value: getUserId(label),
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
      <div className="select">
          <CreatableSelect
            components={components}
            inputValue={inputValue}
            isClearable
            isMulti
            menuIsOpen={false}
            onChange={this.handleChange}
            onInputChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
            placeholder="Type something and press enter..."
            value={value}
          />

          <Select
            isMulti
            defaultInputValue=""
            onChange={this.handleChange}
            defaultValue={[]}
            options={artists}
            placeholder="Or choose artists to based your recommendations on"
          />
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
