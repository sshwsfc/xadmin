import React from 'react';
import app, { StoreWrap } from 'xadmin';
import { Button, Navbar, Card, Form } from 'react-bootstrap';
import { Page, Icon } from 'xadmin-layout';
import { SchemaForm } from 'xadmin-form';
import models from './models';

const DefaultLayout = (props) => {
  const { children, invalid, handleSubmit, submitting } = props
  const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
  const { _t } = app.context
  return (
    <Form onSubmit={handleSubmit}>
      <Card body>{children}</Card>
      <Navbar bg="light" expand="lg">
        <Button type="submit" disabled={invalid || submitting} onClick={handleSubmit} variant="primary">
          <Icon name={icon}/> {_t('Save')}</Button>
      </Navbar>
    </Form>
  )
}
class App extends React.Component {
  render() {
    const { _t } = app.context
    return (
      <Page title={`测试` + _t('Create {{name}}', { name: this.props.title })} nav={<Button variant="outline-success" onClick={this.props.add}>Add</Button>}>
        <SchemaForm
          formKey="test"
          schema={models.User}
          initialValues={{ name: 'test' }}
          onSubmit={console.log}
          component={DefaultLayout}
          wrapProps={{
            destroyOnUnmount: false,
            enableReinitialize: false
          }}
        />
      </Page>
    );
  }
}

export default StoreWrap('test', {
  data: ({ state }) => ({ title: state.test }),
  method: {
    add: ({ dispatch }) => () => dispatch({ type: 'TEST_ADD' })
  }
})(App);
