import React from 'react'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import { Block } from '../index'

export default React.createClass({

  propTypes: {
    site_title: React.PropTypes.any
  },

  render() {
    return (
      <Navbar inverse fixedTop fluid>
        { Block('top.left', this) }
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">{this.props.site_title}</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            { Block('top.right', this) }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }

})
