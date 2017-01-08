import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { TopNav, Bread, MainMenu, Footer } from '../components'
import { Block, config as _c } from '../index'
import { IsAuthenticated } from '../auth/wrap'

export default IsAuthenticated(React.createClass({

  render() {
    return (
      <Row>
        <Col key={0.1} sm={3} lg={2}>
          <MainMenu/>
        </Col>
        <Col key={0.2} sm={9} lg={10}>
          {this.props.children}
        </Col>
      </Row>
    )
  }

}))
