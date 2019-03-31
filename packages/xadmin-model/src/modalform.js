import React from 'react'
import { ModelWrap } from 'xadmin-model'
import { SchemaForm } from 'xadmin-form'
import { C } from 'xadmin-ui'

@ModelWrap('model.page.list')
@ModelWrap('model.item')
@ModelWrap('modalform.modal')
class AddModelBtn extends React.Component {

  hideModal = () => {
    this.props.onClose()
  }

  onSubmitSuccess = (item) => {
    this.hideModal()
    this.props.onSuccess(item)
  }

  render() {
    const { show, model, title, saveItem, canAdd } = this.props
    
    return canAdd ? (
      <SchemaForm 
        formKey={`model.modalform.${model.key}`}
        schema={model}
        onSubmit={saveItem}
        onSubmitSuccess={this.onSubmitSuccess}
      >
        { props => <C is="Form.ModalLayout" {...props} title={title} show={show} onClose={this.hideModal} />}
      </SchemaForm>
    ) : null
  }

}

export default {
  name: 'xadmin.model.modalform',
  blocks: {
    'model.list.navbtn': () => <AddModelBtn />
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
