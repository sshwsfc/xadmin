import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { TopNav, Bread, MainMenu, Footer } from '../components'
import { Block, config as _c } from '../index'

export default React.createClass({

  render() {
    return (
      <div className="container-fluid" style={{ paddingTop: '65px' }}>
        <TopNav site_title={_c('site.title', 'Admin')}/>
        <Row>
          <Col key={0.1} sm={1} md={2}>
            <MainMenu/>
          </Col>
          <Col key={0.2} sm={11} md={10}>
            {this.props.children}
          </Col>
        </Row>
        <Footer/>
      </div>
    )
  }

})
