import React from 'react';
import app, { StoreWrap } from 'xadmin';
import { Page, Icon } from 'xadmin-ui';
import { SchemaForm, FormWrap } from 'xadmin-form';
import models from './models';

class App extends React.Component {

  state = { show: false }

  handleClose = () => {
    this.setState({ show: false })
  }

  handleShow = () => {
    this.setState({ show: true })
  }

  render() {
    const { _t } = app.context
    return (
      <Page title="Dashboard">
        <SchemaForm
          formKey="test"
          schema={models.User}
          initialValues={{ name: 'test' }}
          onSubmit={console.log}
        />
      </Page>
    );
  }
}

export default StoreWrap('test', { 
  data: ({ state }) => ({ title: state.test }),
  event: {
    mount: ({ dispatch }) => dispatch({ type: '@@xadmin/ADD_NOTICE', headline: 'Test', message: 'Test message' })
  }
})(App);
