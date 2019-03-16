import React from 'react'
import { Row, Col, Breadcrumb, Card, Nav, Navbar, Container } from 'react-bootstrap'
import { Block, config as _c, app } from 'xadmin'
import Icon from 'react-fontawesome'

class Bread extends React.Component {
  render() {
    return (
      <Breadcrumb>
        <Breadcrumb.Item href="#">
        Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
        Data
        </Breadcrumb.Item>
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
        <Block name="footer" el={this} />
      </div>
    )}
}

class MainMenu extends React.Component {
  render() {
    return (
      <Card body>
        <Nav variant="pills" className="flex-column">
          <Block name="main.menu" el={this} />
        </Nav>
      </Card>
    )}
}

class Page extends React.Component {
  render() {
    return (
      <Container className={'px-0 ' + this.props.className} style={this.props.style} fluid>
        <Navbar key="page-nav" bg="light" className="mb-3">
          <Navbar.Brand>{ this.props.title }</Navbar.Brand>
          {this.props.nav}
        </Navbar>
        <React.Fragment key="page-content">
          {this.props.children}
        </React.Fragment>
      </Container>
    )}
}

class TopNav extends React.Component {
  render() {
    return (
      <Navbar bg="dark" variant="dark" sticky="top" expand="lg">
        <Navbar.Brand href="#" onClick={() => app.go('/app/')}>{this.props.site_title}</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="mr-auto">
            <Block name="top.left" el={this} />
          </Nav>
          <Block name="top.center" el={this} />
          <Nav>
            <Block name="top.right" el={this} />
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

class Main extends React.Component {
  render() {
    return (
      <>
        <Block name="body" el={this} />
        <TopNav site_title={_c('site.title', 'Admin')}/>
        <Container fluid className="mt-3">
          <Block name="main" el={this} />
          {this.props.children}
        </Container>
        <Footer/>
      </>
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

class Loading extends React.Component {
  render() {
    return <Card body className="text-center"><Icon name="spinner fa-spin fa-4x"/></Card>
  }
}

export {
  App, Main, Page, Loading
}
