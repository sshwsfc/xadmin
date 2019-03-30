import React from 'react'
import _ from 'lodash'
import { Modal, Menu, Form } from 'antd'
import { SchemaForm } from 'xadmin-form'

import { app } from 'xadmin'
import { ModelWrap, Model } from 'xadmin-model'

@ModelWrap('actons.batch_change')
@ModelWrap('model.list.actions')
class BatchChangeBtn extends React.Component {

  state = { show: false }

  onClose = () => {
    this.setState({ show: false })
  }

  onBatchChange = (value) => {
    this.props.onBatchChange(value)
  }

  renderModel() {
    const { model, fields } = this.props
    const { _t } = app.context
    const show = this.state.show

    return (
      <SchemaForm key="actions_batch_change_form" formKey={`model_batch.${model.key}`} 
        schema={_.omit({
          ...model,
          properties: _.pick(model.properties, fields),
          form: model.form !== undefined ? model.form.filter(obj => {
            return obj == '*' || fields.indexOf(obj) >= 0 || fields.indexOf(obj.key) >= 0 }) : [ '*' ]
        }, 'required')}
        onSubmit={(values) => this.onBatchChange(values)}
        onSubmitSuccess={this.onClose}
        onClose={this.onClose}>
        { ({ children, invalid, handleSubmit, submitting, onClose }) => (
          <Modal key="actions_batch_change_modal" visible={show} onClose={onClose}
            title={_t('Please input the value to batch change items')}
            okText={_t('Change')}
            onOk={handleSubmit}
            okButtonDisabled={invalid || submitting}
            cancelText={_t('Cancel')}
            onCancel={this.onClose}
          >
            <Form onSubmit={handleSubmit}>{children}</Form>
          </Modal>
        ) }
      </SchemaForm>
    )
  }

  render() {
    const { selected, canEdit, fields, onBatchChange, ...props } = this.props
    const { _t } = app.context

    return (canEdit && fields.length > 0) ? [ (
      <Menu.Item {...props} key="actions_batch_change" 
        onClick={(e)=>{
          props.onClick(e)
          this.setState({ show: true })
        }} disabled={selected.length == 0}>
        {_t('Batch Change Items')}
      </Menu.Item>
    ),
    selected.length > 0 ? this.renderModel() : null
    ] : null
  }

}

export default BatchChangeBtn
