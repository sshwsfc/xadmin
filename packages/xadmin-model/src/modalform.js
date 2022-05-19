import React from 'react'
import { SchemaForm } from 'xadmin-form'
import { C } from 'xadmin-ui'
import { _t } from 'xadmin-i18n'
import { use } from 'xadmin'
import {
  atom, useSetRecoilState, useRecoilState
} from 'recoil'

const modalItem = atom({
  key: 'modalItem', default: null
})

const ItemModalForm = () => {
  const { model } = use('model')
  const message = use('message')
  const { canAdd, canEdit } = use('model.permission')
  const { saveItem } = use('model.save')
  const { getItems } = use('model.getItems')
  const [ modalItemId, setModalItemId ] = useRecoilState(modalItem)
  const { data, loading } = use('model.item', { id: modalItemId })

  const hideLoading = React.useRef()

  const show = !_.isNil(modalItemId)

  const hideModal = () => setModalItemId(null)

  const onSubmitSuccess = (item) => {
    hideModal()
    getItems()
  }

  React.useEffect(() => {
    if(message?.loading) {
      if(loading) {
        hideLoading.current = message?.loading(_t('Loading data'))
      } else if(hideLoading.current) {
        hideLoading.current()
        hideLoading.current = null
      }
    }
  }, [ loading ])

  const hasPermission = (data?.id == undefined && canAdd) ||(data?.id != undefined && canEdit)
  return ( hasPermission && show && !loading ) ? (
    <SchemaForm 
      formKey={`model.modalform.${model.key}.${modalItemId}`}
      schema={model}
      initialValues={data}
      onSubmit={saveItem}
      onSubmitSuccess={onSubmitSuccess}
      {...model.formProps}
    >
      { props => <C is="Form.ModalLayout" {...props} title={model.title} show={show} onClose={hideModal} />}
    </SchemaForm>
  ) : null
}

export default {
  name: 'xadmin.model.modalform',
  blocks: {
    'model.list.navbtn': () => <ItemModalForm />
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
  hooks: {
    'model.event': () => {
      const setModalItemId = useSetRecoilState(modalItem)

      return {
        onAdd: () => setModalItemId(''),
        onSaved: () => setModalItemId(null),
        onEdit: (id) => setModalItemId(id)
      }
    }
  }
}
export { ItemModalForm }
