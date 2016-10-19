import React from 'react'
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap'

module.exports = React.createClass({

  propTypes: {
    title: React.PropTypes.node,
    nav: React.PropTypes.node
  },

  render() {
    return (
      <div>
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">{ this.props.title }</a>
            </Navbar.Brand>
          </Navbar.Header>
          {this.props.nav}
        </Navbar>
        {this.props.children}
      </div>
    )
  }

})
