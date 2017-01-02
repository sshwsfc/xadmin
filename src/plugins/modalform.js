import React from 'react'
import { PropTypes, createElement } from 'react'
import _ from 'lodash'
import { ButtonToolbar, Button, Modal } from 'react-bootstrap'
import { Icon } from '../components'
import { ModelWrap } from '../model/base'
import { SchemaForm } from '../form'
import { Block, StoreWrap, app } from '../index'

const AddModelBtn = ModelWrap('modalform.modal')(ModelWrap('model.item')(React.createClass({

  propTypes: {
    id: PropTypes.string,
    data: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    model: PropTypes.object.isRequired,
    key: PropTypes.string.isRequired,
    getItem: PropTypes.func.isRequired,
    saveItem: PropTypes.func.isRequired
  },

  getInitialState() {
    return { show: false }
  },

  showModal() {
    this.setState({ show: true })
  },

  hideModal() {
    this.setState({ show: false })
  },

  onSubmitSuccess(item) {
    this.props.onSuccess(item)
    this.hideModal()
  },

  render() {
    const { model, title, loading, saveItem, canAdd, ...formProps } = this.props
    const { _t } = app.context
    const FormLayout = (props) => {
      const { children, invalid, handleSubmit, submitting, onClose } = props
      const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
      return (
        <form className="form-horizontal">
          <Modal.Body>{children}</Modal.Body>
          <Modal.Footer>
            <Button onClick={onClose}>{_t('Close')}</Button>
            <Button bsStyle="primary" disabled={invalid || submitting} onClick={handleSubmit}><Icon name={icon}/> {_t('Save')}</Button>
          </Modal.Footer>
        </form>
      )
    }
    
    return canAdd ? (
      <span>
        <Button bsStyle="primary" onClick={this.showModal}>
          {_t('Add {{object}}', { object: model.title })}
        </Button>
        {' '}
        <Modal
          {...formProps}
          show={this.state.show}
          onHide={this.hideModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <SchemaForm 
            formKey={`model.${model.key}`}
            schema={model}
            onSubmit={saveItem}
            onClose={this.hideModal}
            component={FormLayout}
            onSubmitSuccess={this.onSubmitSuccess}
          />
        </Modal>
      </span>
    ) : null
  }

})))

export default {
  AddModelBtn,
  app: {
    name: 'xadmin.model.modalform',
    blocks: {
      'model.list.navbtn': ({ nodes, ...props }) => {
        return <AddModelBtn {...props} />
      }
    },
    mappers: {
      'modalform.modal': {
        method: {
          onSuccess: ({ model, dispatch }) => (item) => {
            dispatch({ model, type: 'GET_ITEMS' })
          }
        }
      }
    }
  }
}
