import React from 'react'
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, Panel} from 'react-bootstrap'
import Icon from './Icon'

module.exports = React.createClass({

  propTypes: {
    site_title: React.PropTypes.string
  },

  render() {
    return (
      <Panel>
        <Nav bsStyle="pills" stacked>
          <NavItem href="/"><Icon name="home"/> Home</NavItem>
          <NavItem href="/model/user/list"><Icon name="user"/> User</NavItem>
          <NavItem href="/model/car/list"><Icon name="car"/> Cars</NavItem>
        </Nav>
      </Panel>
    )
  }

})
