import React from 'react'
import {Row, Col} from 'react-bootstrap'
import {TopNav, Bread, MainMenu, Footer} from '../components'

let MainApp = React.createClass({

  propTypes: {
  },

  render() {
    return (
      <div className="container-fluid" style={{paddingTop: '65px'}}>
        <TopNav site_title={'新后台'}/>
        <Row>
          <Col sm={1} md={2}>
            <MainMenu/>
          </Col>
          <Col sm={11} md={10}>
            <Bread/>
            {this.props.children}
          </Col>
        </Row>
        <Footer/>
      </div>
    )
  }

})

module.exports = MainApp
