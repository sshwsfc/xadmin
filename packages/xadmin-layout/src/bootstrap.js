import React from 'react'
import { Row, Col, Breadcrumb, Card, Nav, Navbar, Container } from 'react-bootstrap'
import { Block, config as _c } from 'xadmin'
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
      </div>
    )}
}

class MainMenu extends React.Component {
  render() {
    return (
      <Card body>
        <Nav bsStyle="pills" stacked>
          <Block name="main.menu" {...this.props} />
        </Nav>
      </Card>
    )}
}

class Page extends React.Component {
  render() {
    return (
      <Container className={this.props.className} style={this.props.style} fluid>
        <Navbar bg="light">
          <Navbar.Brand>{ this.props.title }</Navbar.Brand>
          {this.props.nav}
        </Navbar>
        {this.props.children}
      </Container>
    )}
}

class TopNav extends React.Component {
  render() {
    return (
      <Container>
        <Navbar bg="dark" variant="dark" fixed="top" expand="lg">
          <Navbar.Brand href="#">{this.props.site_title}</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar-nav" />
          <Navbar.Collapse id="main-navbar-nav">
            <Nav className="mr-auto">
              <Block name="top.left" {...this.props} />
            </Nav>
            <Block name="top.center" {...this.props} />
            <Nav>
              <Block name="top.right" {...this.props} />
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
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

class Loading extends React.Component {
  render() {
    return <Card body className="text-center"><Icon name="spinner fa-spin fa-4x"/></Card>
  }
}

export {
  App, Main, Page, Loading
}
