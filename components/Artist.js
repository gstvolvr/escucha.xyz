import React from 'react'
import Image from 'react-bootstrap/Image'

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
      <a target="_blank" href={this.props.url} className="hovereffect">
        <Image src={this.props.src}/>
        <p className="overlay">{this.props.name}</p>
      </a>
    )
  }
}
