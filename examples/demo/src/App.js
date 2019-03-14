import React from 'react';
import app, { StoreWrap } from 'xadmin';
import { Button, Navbar, Card, Form, Modal, ButtonGroup, Badge } from 'react-bootstrap';
import { Page, Icon } from 'xadmin-layout';
import { SchemaForm, FormWrap } from 'xadmin-form';
import { SimpleGroup } from 'xadmin-form/lib/components/groups'
import models from './models';

const ButtonBadge = FormWrap({
  data: ({ formState }) => ({ count: formState && formState.values && formState.values.id })
})((props) => (
  <Badge variant="light">{props.count || 0}</Badge>
))

const DefaultLayout = (props) => {
  const { children, invalid, handleSubmit, submitting } = props
  const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
  const { _t } = app.context
  return (
    <Form onSubmit={handleSubmit}>
      <Card className="mt-3 mb-3" body>{children}</Card>
      <Navbar bg="light" expand="lg">
        <Button type="submit" disabled={invalid || submitting} onClick={handleSubmit} variant="primary">
          <Icon name={icon}/> {_t('Save')} {' '}
          <ButtonBadge />
        </Button> 
      </Navbar>
    </Form>
  )
}
class App extends React.Component {

  state = { show: false }

  handleClose = () => {
    this.setState({ show: false })
  }

  handleShow = () => {
    this.setState({ show: true })
  }

  renderModal = (props) => {
    return (
      <Modal show={this.state.show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Test Form in Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.children}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={props.handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  render() {
    const { _t } = app.context
    return (
      <Page title="Dashboard" nav={
        <ButtonGroup>
          <Button variant="outline-success" onClick={this.props.add}>{_t('Create {{name}}', { name: this.props.title })}</Button>
          <Button variant="outline-success" onClick={this.handleShow}>Open</Button> 
        </ButtonGroup>
      }>
        <SchemaForm
          formKey="test"
          schema={models.User}
          initialValues={{ name: 'test' }}
          onSubmit={console.log}
          component={DefaultLayout}
        />
        { this.state.show && <SchemaForm
          formKey="testModal"
          schema={models.User}
          initialValues={{ name: 'test' }}
          onSubmit={console.log}
          component={this.renderModal}
          group={SimpleGroup}
        /> }
      </Page>
    );
  }
}

export default StoreWrap('test', { data: ({ state }) => ({ title: state.test }) })(App);
