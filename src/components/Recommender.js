import Artists from './Artists'
import Button from 'react-bootstrap/Button'
import InlineDropdown from './InlineDropdown'
import Description from './Description'
import React from 'react'
import ReactDOM from 'react-dom'
import Select from 'react-select'

function RenderArtists(chosen, numRecs, category, ref) {
  if (chosen.length === 0) {
    alert("I'll need a bit more information from you")
    return
  }
  var root = document.getElementById('root')

  ReactDOM.render(
    <Artists values={chosen} numRecs={numRecs} category={category} reference={ref}/>,
    root
  )
}

const map = {
  "recommendations-0.01": "very well known",     // remove top 0.01%
  "recommendations-0.05": "somewhat well known", // remove top 0.05%
  "recommendations-0.25": "not that well known", // remove top 0.25%
  "recommendations-1.0": "somewhat obscure",    // remove top 1%
  "recommendations-2.0": "totally obscure"      // remove top 2%
}

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
    this.setState({chosen: newValue.map(element => element["value"])})
  }

  componentDidMount() {
    var ref = this.state.reference
    var artistsToShow = 500
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
        this.setState({
          inputValue: '',
          value: [...this.state.value, this.state.inputValue],
          artists: this.state.artists
        })
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
    return (
      <div className='cover-container'>
        <Description />
        <Select
          isMulti
          defaultInputValue=""
          onChange={this.handleChange}
          defaultValue={[]}
          options={this.state.artists}
          placeholder="Who do you listen to?"
          theme={themes}
        />
        <br></br>
        <InlineDropdown map={map} handleFirstChange={this.handleFirstChange.bind(this)} handleSecondChange={this.handleSecondChange.bind(this)} numRecs={this.state.numRecs} category={this.state.category} />
        <br></br>
        <Button variant="primary" size="sm" onClick={() => RenderArtists(this.state.chosen, this.state.numRecs, this.state.category, this.props.reference)} block>
          See artists
        </Button>
      </div>
    )
  }
}
