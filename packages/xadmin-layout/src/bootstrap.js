import React from 'react'
import { Row, Col, Breadcrumb, BreadcrumbItem, Panel, Nav, Navbar } from 'react-bootstrap'
import { Block, config as _c } from 'xadmin-core'

class Bread extends React.Component {
  render() {
    return (
    <Breadcrumb>
      <BreadcrumbItem href="#">
        Home
      </BreadcrumbItem>
      <BreadcrumbItem active>
        Data
      </BreadcrumbItem>
    </Breadcrumb>
  )}
}

class Footer extends React.Component {
  render() {
    return (
    <div id="footer">
      <hr/>
      <footer className="text-center">
          <p>&copy; <slot>{_c('site.copyright')}</slot></p>
      </footer>
    </div>
  )}
}

class MainMenu extends React.Component {
  render() {
    return (
    <Panel>
      <Nav bsStyle="pills" stacked>
        { Block('main.menu', this) }
      </Nav>
    </Panel>
  )}
}

class Page extends React.Component {
  render() {
    return (
    <div>
      <Navbar fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <a>{ this.props.title }</a>
          </Navbar.Brand>
        </Navbar.Header>
        {this.props.nav}
      </Navbar>
      {this.props.children}
    </div>
  )}
}

class TopNav extends React.Component {
  render() {
    return (
      <Navbar inverse fixedTop fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">{this.props.site_title}</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          { Block('top.left', this) }
          <Nav pullRight>
            { Block('top.right', this) }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

class Main extends React.Component {
  render() {
    return (
    <div className="container-fluid" style={{ paddingTop: this.props.paddingTop || 70 }}>
      { Block('main', this)}
      <TopNav site_title={_c('site.title', 'Admin')}/>
      {this.props.children}
      <Footer/>
    </div>
  )}
}

class App extends React.Component {
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
  )}
}

export {
  App, Main, Page
}
