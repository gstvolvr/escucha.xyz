import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'

export default class InlineDropdown extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: this.props.map[this.props.category],
      numRecs: this.props.numRecs
    }
  }

  render() {
    return (
      <div className="inline-dropdown-container">
        <div className="dropdown-text">
          <span className="dropdown-label">Show me</span>
          <Dropdown className="custom-dropdown">
            <Dropdown.Toggle variant="outline-primary" id="drop-num" className="dropdown-toggle">
              {this.props.numRecs}
            </Dropdown.Toggle>

            <Dropdown.Menu onClick={this.props.handleFirstChange.bind(this)}>
              <Dropdown.Item id="8">8</Dropdown.Item>
              <Dropdown.Item id="16">16</Dropdown.Item>
              <Dropdown.Item id="32">32</Dropdown.Item>
              <Dropdown.Item id="64">64</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <span className="dropdown-label">artists who are</span>
          <Dropdown className="custom-dropdown">
            <Dropdown.Toggle variant="outline-primary" id="drop" className="dropdown-toggle">
              {this.props.map[this.props.category]}
            </Dropdown.Toggle>

            <Dropdown.Menu onClick={this.props.handleSecondChange.bind(this)}>
              <Dropdown.Item id="recommendations-0.01">{this.props.map["recommendations-0.01"]}</Dropdown.Item>
              <Dropdown.Item id="recommendations-0.05">{this.props.map["recommendations-0.05"]}</Dropdown.Item>
              <Dropdown.Item id="recommendations-0.25">{this.props.map["recommendations-0.25"]}</Dropdown.Item>
              <Dropdown.Item id="recommendations-1.0">{this.props.map["recommendations-1.0"]}</Dropdown.Item>
              <Dropdown.Item id="recommendations-2.0">{this.props.map["recommendations-2.0"]}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    )
  }
}
