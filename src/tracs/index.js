import React from 'react'

import { Navbar, Nav, FormGroup, FormControl, Button, NavItem, NavDropdown, MenuItem, Badge, Panel, Row, Col, ListGroup, ListGroupItem, Well } from 'react-bootstrap'
import { Icon, Page } from '../components'
import models from './models'
import { app } from '../index'
import DocView from './DocView'

const Dashboard = () => {
  return (
    <Page title="Dashboard">
      <Row>
        <Col key={0.1} sm={1} md={7}>
          <Panel collapsible defaultExpanded header="My Documents">
            My recently created documents. 
            <ListGroup fill>
              <ListGroupItem>1_1524-WLP161351_1ENG</ListGroupItem>
              <ListGroupItem>1_1524-WSN165483_1ENG</ListGroupItem>
              <ListGroupItem>&hellip;</ListGroupItem>
            </ListGroup>
            Show more ...
          </Panel>
          <Panel collapsible defaultExpanded header="Released Documents">
            Recently released documents. 
            <ListGroup fill>
            <ListGroupItem><a href="/model/document/581b29f057be493065c28f05/edit">1_1524-WSN165483_1ENG</a> by Tom</ListGroupItem>
            <ListGroupItem><a>1_1524-YLV167564_1ENG</a> by Lilas</ListGroupItem>
              <ListGroupItem>&hellip;</ListGroupItem>
            </ListGroup>
            Show more ...
          </Panel>
        </Col>
        <Col key={0.2} sm={1} md={5}>
          <Panel collapsible defaultExpanded header="Review Invite">
            <ListGroup fill>
            <ListGroupItem>Tom invited you to review document <a>1_1524-KRC161282_1ENG</a>, click to view.</ListGroupItem>
              <ListGroupItem>Lily invited you to review document <a>1_1524-KRC161282_1ENG</a>, click to view.</ListGroupItem>
              <ListGroupItem>&hellip;</ListGroupItem>
            </ListGroup>
            Show more ...
          </Panel>
          <Panel collapsible defaultExpanded header="Comments">
            Some comments for your documents.
            <ListGroup fill>
              <ListGroupItem>
                <Well bsSize="small">Note 1 added for clarification</Well>
                Tom comment your doc <a>1_1524-KRC161282_1ENG</a>
              </ListGroupItem>
              <ListGroupItem>&hellip;</ListGroupItem>
            </ListGroup>
            Show more ...
          </Panel>
        </Col>
      </Row>
    </Page>
    )
}

export default {
  config: {
    'site.title': (<span><Icon name="cube" /> Ericsson Test Requirement Document</span>),
    'site.copyright': 'Ericsson @2016-2020'
  },
  blocks: {
    'main.menu': ({ nodes }) => {
      nodes.unshift(
        <NavItem onSelect={()=>app.go('/dashboard')}><Icon name="dashboard"/> Dashboard</NavItem>,
        (<NavItem key="released" onSelect={()=>app.go('/model/released/list')}>
                <Icon name="cloud"/> Released Docs</NavItem>)
      )
    },
    'top.right': () => [
      (<NavDropdown eventKey={0} 
          title={<span><Icon name="plus-circle" /> Create Document</span>} id="basic-nav-dropdown">
          <MenuItem eventKey={0.1} onSelect={()=>app.go('/model/document/add')}>Blank Document</MenuItem>
          <MenuItem eventKey={0.2}>Import From File</MenuItem>
          <MenuItem eventKey={0.3}>Copy From Version</MenuItem>
        </NavDropdown>),
      <NavItem eventKey={1} href="#" onSelect={()=>app.go('/model/message/list')}><Icon name="bell-o" /> Message <Badge>42</Badge></NavItem>,
      (<NavDropdown eventKey={0} 
          title={<span><Icon name="user" /> TIMI</span>} id="basic-nav-dropdown">
          <MenuItem eventKey={0.1}>Logout</MenuItem>
        </NavDropdown>)
    ]
  },
  routers: (app) => {
    return {
      '/': [ {
        path: 'dashboard',
        component: Dashboard
      }, {
        path: 'fake/version/view',
        component: DocView
      }, {
        path: 'fake/version/edit',
        component: DocView
      } ]
    }
  },
  mappers: {
    'message.item': {
      method: {
        onMarkreaded:  ({ dispatch, modelState, model }) => (message) => {
          message.readed = true
          dispatch({ model, type: 'SAVE_ITEM', item: message })
        }
      }
    }
  },
  models
}
