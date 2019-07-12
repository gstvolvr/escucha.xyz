import Artist from './Artist'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import React from 'react'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'

export default class Artists extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rich: []
    }
  }

  componentDidMount() {
    var items = []
    var chosenArtists = this.props.values
    var recsPerArtist = parseInt(this.props.numRecs / chosenArtists.length)
    console.log(chosenArtists)
    console.log(recsPerArtist)
    console.log(this.props.category)
    this.props.values.forEach(id => this.props.reference.doc(id).collection(this.props.category).get().then(snapshot => {
      this.setState({rich: (snapshot.docs.slice(0, recsPerArtist).map(doc => {
        return doc.data()
      })
    )})
    }))
  }

  shouldComponentUpdate() {
    return this.state.rich.length == 0
  }

  render() {
    var artistsPerRow = 4
    var cols = []
    var rows = []
    var i = 1

    if (this.state.rich.length == 0) {
      return <Spinner animation="border" />
    }

    this.state.rich.forEach(r => {

      cols.push(
        <Col key={i}>
          <Artist src={r["image_url"]} name={r["name"]} url={r["spotify_url"]}/>
        </Col>
      )

      if (i % artistsPerRow == 0 & i != 0) {
        rows.push(
          <Row key={i}>
            {cols}
          </Row>
        )
        cols = []
      }
      i += 1
    })
    console.log(rows)

    return (
      <Container fluid>
        {rows}
      </Container>
    )
  }
}
