import React from 'react'
import Figure from 'react-bootstrap/Figure'

export default class Artist extends React.Component {
  constructor(props) {
    super(props)
    this.attachRef = target => this.setState({ target });
  }

  render() {
    // increase size of the image if on laptop
    var imgSize = (typeof window.orientation !== 'undefined')? 117: 234

    return (
      <a target="_blank" rel="noopener noreferrer" href={this.props.url} className="artist-link">
        <Figure className="artist-figure">
          <div className="img-container">
            <Figure.Image 
              bsPrefix=".img" 
              height={imgSize} 
              width={imgSize} 
              fluid 
              src={this.props.src.replace("www.olvr.xyz", "www.oliver.dev")}
              className="artist-image"
            />
          </div>
          <Figure.Caption className="artist-name">{this.props.name}</Figure.Caption>
        </Figure>
      </a>
    )
  }
}
