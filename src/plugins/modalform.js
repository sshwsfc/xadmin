import React from 'react'
import { PropTypes, createElement } from 'react'
import _ from 'lodash'
import { ButtonToolbar, Button, Modal } from 'react-bootstrap'
import { Icon } from '../components'
import { ModelWrap } from '../model/base'
import { SchemaForm } from '../form'
import { Block, StoreWrap, app } from '../index'

const AddModelBtn = ModelWrap('model.form')(React.createClass({

  getInitialState() {
    return { show: false }
  },

  showModal() {
    this.setState({ show: true })
  },

  hideModal() {
    this.setState({ show: false })
  },

  propTypes: {
    id: PropTypes.string,
    title: React.PropTypes.string.isRequired,
    data: PropTypes.object,
    schema: PropTypes.object.isRequired,
    formKey: PropTypes.string.isRequired,
    updateItem: PropTypes.func.isRequired
  },

  render() {
    const { schema, title, data, formKey, loading, updateItem } = this.props
    const FormLayout = (props) => {
      const { children, invalid, handleSubmit, submitting } = props
      const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
      return (
        <form className="form-horizontal">
          {children}
        </form>
      )
    }
    return (
      <span>
        <Button bsStyle="primary" onClick={this.showModal}>
          Add
        </Button>
        {' '}
        <Modal
          {...this.props}
          show={this.state.show}
          onHide={this.hideModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SchemaForm 
            formKey={formKey}
            schema={schema}
            onSubmit={updateItem}
            initialValues={data}
            component={FormLayout} />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      </span>
    )
  }

}))

export default {
  blocks: {
    'model.list.navbtn': ({ nodes, ...props }) => {
      return <AddModelBtn {...props} />
    }
  }
}
