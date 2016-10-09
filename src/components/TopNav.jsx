import React from 'react'
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap'
import { Block } from '../index'

let TopNav = React.createClass({

  propTypes: {
    site_title: React.PropTypes.string
  },

  render() {
    return (
      <Navbar inverse fixedTop fluid>
        { Block('main.top', this) }
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">{this.props.site_title}</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavItem eventKey={1} href="#">Link</NavItem>
            <NavItem eventKey={2} href="#">Link</NavItem>
            <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
              <MenuItem eventKey={3.1}>Action</MenuItem>
              <MenuItem eventKey={3.2}>Another action</MenuItem>
              <MenuItem eventKey={3.3}>Something else here</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={3.3}>Separated link</MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }

})

module.exports = TopNav
