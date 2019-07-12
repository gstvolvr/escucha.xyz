import Artists from './Artists'
import Button from 'react-bootstrap/Button'
import InlineDropdown from './InlineDropdown'
import CreatableSelect from 'react-select/lib/Creatable'
import Description from './Description'
import React from 'react'
import ReactDOM from 'react-dom'
import Select from 'react-select'

function RenderArtists(chosen, numRecs, category, ref) {
  if (chosen.length == 0) {
    alert("I'll need a bit more information from you")
    return
  }

  ReactDOM.render(
    <Artists values={chosen} numRecs={numRecs} category={category} reference={ref}/>,
    root
  )
}

function getUserId(link) {
  if (link != null & link.length > 10 & link.slice(0, 4) == "http") {
    var re = /user\/([^/]+)\/playlist/
    var match = re.exec(link)
    if (match != null) return match[1]
  }
  return
}

const map = {
  "recommendations-0.01": "very well known",     // remove top 0.01%
  "recommendations-0.05": "somewhat well known", // remove top 0.05%
  "recommendations-0.25": "not that well known", // remove top 0.25%
  "recommendations-1.0": "somewhat obscure",    // remove top 1%
  "recommendations-2.0": "totally obscure"      // remove top 2%
}

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
    neutral80: "black",   // text color once chosen
    neutral50: "#484848", // placeholder color
    neutral20: "#DCDCDC", // border and features
    neutral30: "#FEFEFE", // border during hover
    neutral40: "#484848", // features during hover and text when empty
    neutral10: "#FFB9D6",
    neutral5: "#DCDCDC",
    neutral0: "#FEFEFE",  // background color
    dangerLight: null
  }
})

export default class Recommender extends React.Component<*, State> {
  constructor(props) {
    super(props)

    this.state = {
      inputValue: "",
      value: [],
      artists: [],
      chosen: [],
      text: "somewhat well known",
      category: "recommendations-0.05",
      reference: this.props.reference,
      numRecs: 8
    }
  }

  handleInputChange = (inputValue: string) => {
    this.setState({inputValue: inputValue})
  }

  handleChange = (newValue: any, actionMeta: any) => {
    console.group('Value Changed')
    console.log(newValue)
    console.log(`action: ${actionMeta.action}`)
    this.setState({chosen: newValue.map(element => element["value"])})
    console.groupEnd()
  }

  componentDidMount() {
    var ref = this.state.reference
    var artistsToShow = 10
    ref.orderBy("connections", "desc").limit(artistsToShow).get().then(snapshot => {
      this.setState({artists: snapshot.docs.map(doc => {
        return {value: doc.id, label: doc.data()["name"], color: "#00B8D9"}
      })})
    })
  }

  handleKeyDown = (event: SyntheticKeyboardEvent<HTMLElement>) => {
    if (!this.state.inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        console.group('Value Added');
        console.log(value);
        console.log(this.state.inputValue);
        console.groupEnd();
        this.setState({
          inputValue: '',
          value: [...this.state.value, this.state.inputValue],
          artists: artists
        })
        console.log(this.state.value)
        event.preventDefault();
    }
  }

  handleFirstChange(e) {
    this.setState({numRecs: e.target.id})
  }

  handleSecondChange(e) {
    var id = e.target.id
    this.setState({
      category: id,
      text: map[id]
    })
  }

  render() {
    const { inputValue, value, artists, chosen } = this.state;
    return (
      <div className='recommender'>
        <Description />
        <div className='react-select-container'>
            <Select
              isMulti
              defaultInputValue=""
              onChange={this.handleChange}
              defaultValue={[]}
              options={this.state.artists}
              placeholder="What artists are you listening to these days?"
              theme={themes}
            />
        </div>
        <br></br>
        <InlineDropdown map={map} handleFirstChange={this.handleFirstChange.bind(this)} handleSecondChange={this.handleSecondChange.bind(this)} numRecs={this.state.numRecs} category={this.state.category} />
        <br></br>
        <Button variant="primary" onClick={() => RenderArtists(this.state.chosen, this.state.numRecs, this.state.category, this.props.reference)} block>
          See artists
        </Button>
      </div>
    )
  }
}
