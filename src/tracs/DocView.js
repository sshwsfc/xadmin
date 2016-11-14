import React from 'react'

import { Button, PageHeader, Table, Navbar, Nav, NavItem, NavDropdown, MenuItem, Badge, Panel, Row, Col, ListGroup, ListGroupItem, Well } from 'react-bootstrap'
import { Page, Icon } from '../components'

export default (props) => {
  const nav = (
    <div className="navbar-btn pull-right hide-xs">
      <Button bsStyle="default" onClick={()=>{alert('OK')}}><Icon name="clone"/> Duplicate</Button>
      &nbsp;
      <Button bsStyle="default"><Icon name="share-alt"/> Invite Review</Button>
      &nbsp;
      <Button bsStyle="success"><Icon name="paper-plane-o"/> Release Document</Button>
    </div>
    )
  return (
    <Page title={(<span><Icon name="table"/> 1_1524-KRC161282_1ENG : PA</span>)} nav={nav}>
      <Nav bsStyle="tabs" activeKey="0.1" onSelect={(e)=>{event.preventDefault()}}>
        <NavItem eventKey="0.1">Doc Info</NavItem>
        <NavItem eventKey="0.2">Overview</NavItem>
        <NavDropdown eventKey="1" title="1.xx" id="nav-dropdown">
          <MenuItem eventKey="1.21">1.21 - Tx TOR Noise</MenuItem>
          <MenuItem eventKey="1.61">1.61 - Rx LNA Bias Check</MenuItem>
        </NavDropdown>
        <NavDropdown eventKey="2" title="2.xx" id="nav-dropdown">
          <MenuItem eventKey="2.21">2.21 - Tx TOR Noise</MenuItem>
          <MenuItem eventKey="2.61">2.61 - Rx LNA Bias Check</MenuItem>
        </NavDropdown>
      </Nav>
      <PageHeader style={{ marginTop: 0 }}><small>1.61 - Rx LNA Bias Check</small></PageHeader>
      <Table bordered>
        <tr>
        <th rowSpan="2">Product</th>
        <th rowSpan="2">Requirement <br />
        source</th>
        <th rowSpan="2">¡¡</th>
        <th colSpan="4" style={{ textAlign: 'center' }}>Config</th>
        <th rowSpan="2">Requirement <br/>
        Tolerance [¡À dB]</th>
        <th rowSpan="2">Added<br />
          <span>&nbsp;</span>margin</th>
        <th rowSpan="2">1524 allowed backoff [dB]</th>
        </tr>
        <tr>
          <th>Power [W]</th>
          <th># of carriers</th>
          <th>mod</th>
          <th>channel</th>
        </tr>
        <tr>
          <td>RUS 02</td>
          <td>Internal</td>
          <td>¡¡</td>
          <td>80</td>
          <td>¡¡</td>
          <td>QPSK</td>
          <td>M</td>
          <td>0.6</td>
          <td>0.6</td>
          <td>0.0</td>
        </tr>
        <tr>
          <td>RUS 02</td>
          <td>Internal</td>
          <td>¡¡</td>
          <td>80</td>
          <td>¡¡</td>
          <td>QPSK</td>
          <td>M</td>
          <td>0.6</td>
          <td>0.6</td>
          <td>0.0</td>
        </tr>
        <tr>
          <td>RUS 02</td>
          <td>Internal</td>
          <td>¡¡</td>
          <td>80</td>
          <td>¡¡</td>
          <td>QPSK</td>
          <td>M</td>
          <td>0.6</td>
          <td>0.6</td>
          <td>0.0</td>
        </tr>
        <tr>
          <td>RUS 02</td>
          <td>Internal</td>
          <td>¡¡</td>
          <td>80</td>
          <td>¡¡</td>
          <td>QPSK</td>
          <td>M</td>
          <td>0.6</td>
          <td>0.6</td>
          <td>0.0</td>
        </tr>
        <tr>
          <td>RUS 02</td>
          <td>Internal</td>
          <td>¡¡</td>
          <td>80</td>
          <td>¡¡</td>
          <td>QPSK</td>
          <td>M</td>
          <td>0.6</td>
          <td>0.6</td>
          <td>0.0</td>
        </tr>
        <tr>
          <td>RUS 02</td>
          <td>Internal</td>
          <td>¡¡</td>
          <td>80</td>
          <td>¡¡</td>
          <td>QPSK</td>
          <td>M</td>
          <td>0.6</td>
          <td>0.6</td>
          <td>0.0</td>
        </tr>
        <tr>
          <td>RUS 02</td>
          <td>Internal</td>
          <td>¡¡</td>
          <td>80</td>
          <td>¡¡</td>
          <td>QPSK</td>
          <td>M</td>
          <td>0.6</td>
          <td>0.6</td>
          <td>0.0</td>
        </tr>
      </Table>
    </Page>
    )
}
