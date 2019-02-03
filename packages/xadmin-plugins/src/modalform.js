import React from 'react'
import PropTypes from 'prop-types'
import { ButtonToolbar, Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Icon from 'react-fontawesome'
import { ModelWrap } from 'xadmin-model'
import { SchemaForm } from 'xadmin-form'
import { Block, StoreWrap, app } from 'xadmin'
import './modalform.css'
@ModelWrap('model.item')
@ModelWrap('modalform.modal')
class AddModelBtn extends React.Component {

  hideModal() {
    this.props.onClose()
  }

  onSubmitSuccess(item) {
    this.hideModal()
    this.props.onSuccess(item)
  }

  render() {
    const { show, model, title, loading, saveItem, canAdd, modalProps, btnProps } = this.props
    const { _t } = app.context

    const FormLayout = (props) => {
      const { children, invalid, handleSubmit, submitting, onClose } = props
      const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
      return (
        <Modal
          {...modalProps}
          show={show}
          className="xadmin-modal-form"
          onHide={this.hideModal.bind(this)}
        >
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="form-horizontal">{children}</form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={onClose}>{_t('Close')}</Button>
            {invalid ? (
              <OverlayTrigger placement="top" overlay={<Tooltip>{_t('Please be sure to complete all field.')}</Tooltip>}>
                <Button type="submit" disabled={submitting} onClick={handleSubmit} bsStyle="primary">
                  <Icon name="ban"/> {_t('Save')}</Button>
              </OverlayTrigger>
            ) : (
              <Button type="submit" disabled={submitting} onClick={handleSubmit} bsStyle="primary">
                <Icon name={icon}/> {_t('Save')}</Button>
            )}
          </Modal.Footer>
        </Modal>
      )
    }
    
    return canAdd && show ? (
      <SchemaForm 
        formKey={`model.modalform.${model.key}`}
        schema={model}
        onSubmit={saveItem}
        onClose={this.hideModal.bind(this)}
        component={FormLayout}
        onSubmitSuccess={this.onSubmitSuccess.bind(this)}
      />
    ) : null
  }

}

export default {
  name: 'xadmin.model.modalform',
  blocks: {
    'model.list.navbtn': ({ nodes, ...props }) => {
      return <AddModelBtn {...props} />
    }
  },
  reducers: {
    showModalAddForm: (state={}, action) => {
      if(action.type == '@@xadmin-modalform/SHOW') {
        return { ...state, [action.model.name]: true }
      } else if(action.type == '@@xadmin-modalform/CLOSE') {
        return { ...state, [action.model.name]: false }
      }
      return state
    }
  },
  mappers: {
    'model.page.list': {
      method: {
        addItem: ({ dispatch, model }) => () => {
          dispatch({ model, type: '@@xadmin-modalform/SHOW' })
        }
      }
    },
    'modalform.modal': {
      data: ({ state, model }) => ({
        show: state.showModalAddForm[model.name] || false
      }),
      method: {
        onClose: ({ model, dispatch }) => (item) => {
          dispatch({ model, type: '@@xadmin-modalform/CLOSE' })
        },
        onSuccess: ({ model, dispatch }) => (item) => {
          dispatch({ model, type: 'GET_ITEMS' })
        }
      }
    }
  }
}
export { AddModelBtn }
