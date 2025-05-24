import Artists from './Artists'
import Button from 'react-bootstrap/Button'
import InlineDropdown from './InlineDropdown'
import Description from './Description'
import React from 'react'
import ReactDOM from 'react-dom'
import Select from 'react-select'
import FirebaseContext from './FirebaseContext'
import { query, orderBy, limit, getDocs } from 'firebase/firestore'

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
  borderRadius: 8,
  colors: {
    ...theme.colors,
    primary25: '#eaeef2', // option background color when focused
    primary: "#2c3e50",   // primary color (matches CSS variable)
    primary50: "#3498db", // option background color when selected
    neutral90: "#333333", // dark text
    neutral80: "#333333", // text color once chosen
    neutral50: "#666666", // placeholder color
    neutral20: "#e0e0e0", // border and features
    neutral30: "#3498db", // border during hover
    neutral40: "#2c3e50", // features during hover and text when empty
    neutral10: "#f5f5f5", // selected option background
    neutral5: "#f9f9f9",  // light background
    neutral0: "#ffffff",  // background color
    dangerLight: "#ffcdd2" // danger light color
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
    const q = query(this.props.firebase.ref, orderBy("connections", "desc"), limit(artistsToShow));
    getDocs(q).then(snapshot => {
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
      <div className='recommender-container'>
        <Description />
        <div className="form-group">
          <Select
            id="artist-select"
            isMulti
            isClearable
            defaultInputValue=""
            onChange={this.handleChange}
            defaultValue={[]}
            options={this.state.artists}
            placeholder="Who do you listen to?"
            theme={themes}
            closeMenuOnSelect={false}
            className="artist-select"
          />
        </div>

        <div className="form-group">
          <InlineDropdown 
            map={map} 
            handleFirstChange={this.handleFirstChange.bind(this)} 
            handleSecondChange={this.handleSecondChange.bind(this)} 
            numRecs={this.state.numRecs} 
            category={this.state.category} 
          />
        </div>

        <div className="form-group">
          <Button 
            variant="primary" 
            size="lg" 
            onClick={() => RenderArtists(this.state.chosen, this.state.numRecs, this.state.category, this.props.firebase)} 
            block
            className="submit-button"
          >
            <span className="button-text">Discover New Artists</span>
          </Button>
        </div>
      </div>
    )
  }
}
