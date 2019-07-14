import React from 'react'
import Image from 'react-bootstrap/Image'
import Figure from 'react-bootstrap/Figure'

export default class Artist extends React.Component {
  constructor(props) {
    super(props)
    this.attachRef = target => this.setState({ target });
    this.state = {
      opacity: 1.0
    }
  }

  render() {
    const { opacity, target } = this.state;
    // increase size of the image if on laptop
    var imgSize = (typeof window.orientation !== 'undefined')? 117: 234
    console.log(imgSize)

    return (
      <a target="_blank" href={this.props.url}>
        <Figure>
          <Figure.Image bsPrefix=".img" height={imgSize} width={imgSize} fluid rounded src={this.props.src}/>
          <Figure.Caption>{this.props.name}</Figure.Caption>
        </Figure>
      </a>
    )
  }
}
