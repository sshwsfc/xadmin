import React from 'react'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Panel } from 'react-bootstrap'
import Icon from './Icon'
import { Block } from '../index'

export default React.createClass({

  propTypes: {
    site_title: React.PropTypes.string
  },

  render() {
    return (
      <Panel>
        <Nav bsStyle="pills" stacked>
          { Block('main.menu', this) }
        </Nav>
      </Panel>
    )
  }

})
