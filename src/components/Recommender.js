import Artists from './Artists'
import Button from 'react-bootstrap/Button'
import InlineDropdown from './InlineDropdown'
import Description from './Description'
import React from 'react'
import ReactDOM from 'react-dom'
import Select from 'react-select'
import FirebaseContext from './FirebaseContext'

function RenderArtists(chosen, numRecs, category, firebase) {
  if (chosen.length === 0) {
    alert("I'll need a bit more information from you")
    return
  }

  ReactDOM.render(
    <Artists values={chosen} numRecs={numRecs} category={category} firebase={firebase}/>,
    document.getElementById('root')
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
  static contextType = FirebaseContext
  constructor(props) {
    super(props)

    this.state = {
      inputValue: "",
      value: [],
      artists: [],
      chosen: [],
      text: "somewhat well known",
      category: "recommendations-0.05",
      numRecs: 8
    }
  }

  handleInputChange = (inputValue: string) => {
    this.setState({inputValue: inputValue})
  }

  handleChange = (newValue: any, actionMeta: any) => {
    if (!newValue) return
    this.setState({chosen: newValue.map(element => element["value"])})
  }

  componentDidMount() {
    var artistsToShow = 750
    this.props.firebase.ref.orderBy("connections", "desc").limit(artistsToShow).get().then(snapshot => {
      this.setState({artists: snapshot.docs.map(doc => {
        return {value: doc.id, label: doc.data()["name"], color: "#00B8D9"}
      })})
    })
  }

  handleFirstChange(e) {
    if (e !== null) this.setState({numRecs: e.target.id})
  }

  handleSecondChange(e) {
    if (e !== null) {
      var id = e.target.id
      this.setState({
        category: id,
        text: map[id]
      })
    }
  }

  render() {
    return (
      <div className='cover-container'>
        <Description />
        <Select
          isMulti
          isClearable
          defaultInputValue=""
          onChange={this.handleChange}
          defaultValue={[]}
          options={this.state.artists}
          placeholder="Who do you listen to?"
          theme={themes}
          closeMenuOnSelect={false}
        />
        <br></br>
        <InlineDropdown map={map} handleFirstChange={this.handleFirstChange.bind(this)} handleSecondChange={this.handleSecondChange.bind(this)} numRecs={this.state.numRecs} category={this.state.category} />
        <br></br>
        <Button variant="primary" size="sm" onClick={() => RenderArtists(this.state.chosen, this.state.numRecs, this.state.category, this.props.firebase)} block>
          See artists
        </Button>
      </div>
    )
  }
}
