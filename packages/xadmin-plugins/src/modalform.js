import React from 'react'
import PropTypes from 'prop-types'
import { ButtonToolbar, Button, Modal } from 'react-bootstrap'
import Icon from 'react-fontawesome'
import { ModelWrap } from 'xadmin-model'
import { SchemaForm } from 'xadmin-form'
import { Block, StoreWrap, app } from 'xadmin'

class AddModelBtnCls extends React.Component {

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
        <form className="form-horizontal">
          <Modal.Body>{children}</Modal.Body>
          <Modal.Footer>
            <Button onClick={onClose}>{_t('Close')}</Button>
            <Button type="submit" bsStyle="primary" disabled={invalid || submitting} onClick={handleSubmit}><Icon name={icon}/> {_t('Save')}</Button>
          </Modal.Footer>
        </form>
      )
    }
    
    return canAdd ? (
      <Modal
        {...modalProps}
        show={show}
        onHide={this.hideModal.bind(this)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <SchemaForm 
          formKey={`model.${model.key}`}
          schema={model}
          onSubmit={saveItem}
          onClose={this.hideModal.bind(this)}
          component={FormLayout}
          onSubmitSuccess={this.onSubmitSuccess.bind(this)}
        />
      </Modal>
    ) : null
  }

}
AddModelBtnCls.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  model: PropTypes.object.isRequired,
  key: PropTypes.string.isRequired,
  getItem: PropTypes.func.isRequired,
  saveItem: PropTypes.func.isRequired
}

const AddModelBtn = ModelWrap('modalform.modal')(ModelWrap('model.item')(AddModelBtnCls))

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
