import { ref, genres} from '../data'
import React from 'react'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Artist from './Artist'

export default class Artists extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rich: []
    }
  }

  componentDidMount() {
    var items = []
    this.props.values.forEach(id => ref.doc(id).collection("recommendations-0.02").get().then(snapshot => {
      this.setState({rich: (snapshot.docs.slice(0, 50).map(doc => {
        return doc.data()
      })
    )})
    }))
  }

  shouldComponentUpdate() {
    console.log("try update")
    return this.state.rich.length == 0
  }

  render() {
    var artistsPerRow = 2
    var cols = []
    var rows = []
    var i = 0

    if (this.state.rich.length == 0) {
      return <div>Loading...</div>
    }

    this.state.rich.forEach(r => {
      console.log(r)
      if (r["image_url"].length == 0) return
      if (i % artistsPerRow == 0 & i != 0) {
        rows.push(
          <Row key={i}>
            {cols}
          </Row>
        )
        cols = []
      }

      cols.push(
        <Col key={i}>
          <Artist src={r["image_url"]} name={r["name"]} url={r["spotify_url"]}/>
        </Col>
      )
      i += 1
    })

    return (
      <Container fluid>
        {rows}
      </Container>
    )
  }
}
