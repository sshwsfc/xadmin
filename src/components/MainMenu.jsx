import React from 'react'
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, Panel} from 'react-bootstrap'
import Icon from './Icon'

module.exports = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  propTypes: {
    site_title: React.PropTypes.string
  },

  render() {
    const router = this.context.router
    const go = (uri) => {
      return (e) => {
        router.push(uri)
      }
    }
    return (
      <Panel>
        <Nav bsStyle="pills" stacked>
          <NavItem onSelect={go("/")}><Icon name="home"/> Home</NavItem>
          <NavItem onSelect={go("/model/user/list")}><Icon name="user"/> User</NavItem>
          <NavItem onSelect={go("/model/car/list")}><Icon name="car"/> Cars</NavItem>
        </Nav>
      </Panel>
    )
  }

})
