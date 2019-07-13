import Artist from './Artist'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import React from 'react'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import 'babel-polyfill';

export default class Artists extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rich: []
    }
  }

  async componentDidMount() {
    var items = []
    var chosenArtists = this.props.values
    var recsPerArtist = parseInt(this.props.numRecs / chosenArtists.length)

    var rich = []
    var promises = this.props.values.map(id => this.props.reference.doc(id).collection(this.props.category).limit(recsPerArtist).get())

    await Promise.all(promises).then(promise => promise.forEach(snapshot => {
      snapshot.docs.forEach(doc => {
        rich.push(doc.data())
      })
    }))

    this.setState({rich: rich})
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

    return (
      <Container fluid>
        {rows}
      </Container>
    )
  }
}
