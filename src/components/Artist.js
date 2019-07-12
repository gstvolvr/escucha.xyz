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
    return (
      <a target="_blank" href={this.props.url}>
        <Figure>
          <Figure.Image bsPrefix=".img" height={156} width={156} thumbnail fluid rounded src={this.props.src}/>
          <Figure.Caption>{this.props.name}</Figure.Caption>
        </Figure>
      </a>
    )
  }
}
