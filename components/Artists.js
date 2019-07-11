import { ref, genres} from '../src/data'
import React from 'react'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Artist from './Artist'
import Image from 'react-bootstrap/Image'

export default class Artists extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rich: []
    }
  }

  componentDidMount() {
    console.log("before")
    console.log(this.props.values)
    console.log("after")
    this.props.values.forEach(id => ref.doc(id).collection("recommendations-1").get().then(snapshot => {
      snapshot.docs.forEach(doc => {
        let element = doc.data()
        this.setState({ rich: [...this.state.rich, element]})
        if (this.state.rich.length > 10) return
      })
    }))
  }

  render() {
    var artistsPerRow = 4
    var cols = []
    var rows = []
    var i = 0

    var subset = this.state.rich.slice(0, 8)
    console.log(subset)
    this.state.rich.forEach(r => {
      console.log(r)
      if (r["image_url"].length == 0) return
      if (i % artistsPerRow == 0 & i != 0) {
        rows.push(
          <Row>
            {cols}
          </Row>
        )
        cols = []
      }

      cols.push(
        <Col xs={"auto"} sm={"auto"} md={"auto"} lg={"auto"}>
          <Artist src={r["image_url"]} name={r["name"]} url={r["spotify_url"]}/>
        </Col>
      )
      i += 1
    })
    return (
      <Container>
        {rows}
      </Container>
    )
  }
}
