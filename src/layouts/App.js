import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { TopNav, Bread, MainMenu, Footer } from '../components'
import { Block, config as _c } from '../index'
import { IsAuthenticated } from '../auth/wrap'

export default IsAuthenticated(React.createClass({

  render() {
    return (
      <Row>
        <Col key={0.1} sm={1} md={2}>
          <MainMenu/>
        </Col>
        <Col key={0.2} sm={11} md={10}>
          {this.props.children}
        </Col>
      </Row>
    )
  }

}))
