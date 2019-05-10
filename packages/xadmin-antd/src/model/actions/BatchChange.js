import React from 'react'
import _ from 'lodash'
import { Modal, Menu, Form } from 'antd'
import { SchemaForm } from 'xadmin-form'
import { app, use } from 'xadmin'

const BatchChangeBtn = props => {
  const { _t } = app.context
  const [ show, setShow ] = React.useState(false)
  const { canEdit, fields, onBatchChange } = use('actons.batch_change', props)
  const { selected } = use('model.select', props)
  const { model } = use('model', props)

  const onClose = () => setShow(false)

  const renderModel = () => {
    return (
      <SchemaForm key="actions_batch_change_form" formKey={`model_batch.${model.key}`} 
        schema={_.omit({
          ...model,
          properties: _.pick(model.properties, fields),
          form: model.form !== undefined ? model.form.filter(obj => {
            return obj == '*' || fields.indexOf(obj) >= 0 || fields.indexOf(obj.key) >= 0 }) : [ '*' ]
        }, 'required')}
        onSubmit={onBatchChange}
        onSubmitSuccess={onClose}
        onClose={onClose}>
        { ({ children, invalid, handleSubmit, submitting, onClose }) => (
          <Modal key="actions_batch_change_modal" visible={show} onClose={onClose}
            title={_t('Please input the value to batch change items')}
            okText={_t('Change')}
            onOk={handleSubmit}
            okButtonDisabled={invalid || submitting}
            cancelText={_t('Cancel')}
            onCancel={onClose}
          >
            <Form onSubmit={handleSubmit}>{children}</Form>
          </Modal>
        ) }
      </SchemaForm>
    )
  }

  return (canEdit && fields.length > 0) ? [ (
    <Menu.Item {...props} key="actions_batch_change" 
      onClick={(e)=>{
        props.onClick(e)
        setShow(true)
      }} disabled={selected.length == 0}>
      {_t('Batch Change Items')}
    </Menu.Item>
  ),
  selected.length > 0 ? renderModel() : null
  ] : null

}

export default BatchChangeBtn
