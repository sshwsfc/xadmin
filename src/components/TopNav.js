import React from 'react'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import { Block } from '../index'
import UserMenu from '../auth/components/UserMenu'
import { ShowAuthenticated } from '../auth/wrap'

const NavRight = ShowAuthenticated(() => {
  return (
    <Nav pullRight>
      { Block('top.right', this) }
      <UserMenu />
    </Nav>
  )
})

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
          <NavRight />
        </Navbar.Collapse>
      </Navbar>
    )
  }

})
