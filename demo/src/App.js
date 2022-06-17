import React from 'react';
import { Page } from 'xadmin-ui';
import { SchemaForm } from 'xadmin-form';
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
    return (
      <Page title="Dashboard">
        <SchemaForm
          formKey="test"
          schema={models.User}
          initialValues={{ superUser: true }}
          onSubmit={values => {
            console.log(values)
            return null
          }}
          onChange={value => { console.log('changed', value) }}
          validate={values => {
            return { }
          }}
        />
      </Page>
    );
  }
}

// export default StoreWrap('test', { 
//   data: ({ state }) => ({ title: state.test }),
//   event: {
//     mount: ({ dispatch }) => dispatch({ type: '@@xadmin/ADD_NOTICE', headline: 'Test', message: 'Test message' })
//   }
// })(App);

export default App