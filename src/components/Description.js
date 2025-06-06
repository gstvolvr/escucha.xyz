import React from 'react'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Table from 'react-bootstrap/Table'

export default class Description extends React.Component<*, State> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      key: 'about',
    }
  }

  render() {
    return (
      <Tabs
        id="about"
        activeKey={this.state.key}
        onSelect={key => this.setState({ key })}
        className="modern-tabs"
      >
        <Tab eventKey="about" title="About">
          <div className="tab-content-container">
            <p>Simple <strong>artist recommender</strong>. Fill out the form, and start discovering new music!</p>
          </div>
        </Tab>
        <Tab eventKey="details" title="How does it work?">
          <div className="tab-content-container">
            <p>It recommends artists based on how frequently they show up in playlists together. The data is composed of <strong>1.7 million</strong> artists and over <strong>10 million</strong> public Spotify playlists.</p>
            <p>I store recommendations for the top <strong>750</strong> artists. Each artist has up to <strong>500</strong> recommendations across these <strong>5</strong> categories:</p>

            <Table variant="light" striped hover size="sm" className="modern-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Ignore the top __ of artists</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>very well known</td>
                  <td>0.01% or 172</td>
                </tr>
                <tr>
                  <td>somewhat well known</td>
                  <td>0.05% or 861</td>
                </tr>
                <tr>
                  <td>not that well known</td>
                  <td>0.25% or 4,307</td>
                </tr>
                <tr>
                  <td>somewhat obscure</td>
                  <td>1.00% or 17,228</td>
                </tr>
                <tr>
                  <td>totally obscure</td>
                  <td>2.00% or 34,456</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Tab>
      </Tabs>
    )
  }
}
