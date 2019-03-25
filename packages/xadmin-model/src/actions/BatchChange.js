import React from 'react'
import _ from 'lodash'
import { Form, Col, Row, Dropdown, Modal, Button } from 'react-bootstrap'
import { SchemaForm } from 'xadmin-form'

import { app } from 'xadmin'
import { ModelWrap, Model } from '../index'

import { Icon } from 'xadmin-ui'

const FieldGroup = ({ label, meta, input, field, children }) => {
  const groupProps = {}
  const attrs = field.attrs || {}
  const error = meta.touched && meta.error
  const help = field.description || field.help
  const size = (field.option && field.option.groupSize) || attrs.groupSize || { 
    label: {
      sm: 4, md: 3, lg: 2 
    },
    control: {
      sm: 8, md: 9, lg: 10
    }
  }

  if (attrs.size) {
    groupProps['size'] = attrs.size
  }
  if (attrs.variant) {
    groupProps['variant'] = attrs.variant
  }

  const controlComponent = children ? children : (<Form.Control {...input} {...attrs} />)
  return (
    <Form.Group as={Row} controlId={input.name} {...groupProps}>
      <Form.Label column {...size.label}>
        {label}{field && field.required ? <span className="text-danger">*</span> : ''}
      </Form.Label>
      <Col {...size.control}>
        {controlComponent}
        {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
        {help && <Form.Text className="text-muted">{help}</Form.Text>}
      </Col>
    </Form.Group>
  )
}

@ModelWrap('actons.batch_change')
@ModelWrap('model.list.actions')
class BatchChangeBtn extends React.Component {

  state = { show: false }

  onClose = () => {
    this.setState({ show: false })
  }

  onBatchChange = (value) => {
    this.props.onBatchChange(value)
    this.onClose()
  }

  renderModel() {
    const { model, fields } = this.props
    const { _t } = app.context
    const show = this.state.show

    return (
      <SchemaForm formKey={`model_batch.${model.key}`} 
        schema={_.omit({
          ...model,
          properties: _.pick(model.properties, fields),
          form: model.form !== undefined ? model.form.filter(obj => {
            return obj == '*' || fields.indexOf(obj) >= 0 || fields.indexOf(obj.key) >= 0 }) : [ '*' ]
        }, 'required')}
        option={{ group: FieldGroup }}
        onSubmit={(values) => this.onBatchChange(values)}
        onClose={this.onClose}>
        { ({ children, invalid, handleSubmit, submitting, onClose }) => (
          <Modal key="actions_batch_change_modal" show={show} onHide={onClose}>
            <Modal.Header closeButton>
              <Modal.Title>{_t('Please input the value to batch change items')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>{children}</Form>
            </Modal.Body>
            <Modal.Footer>
              <Button key={0} variant="light" onClick={onClose}>{_t('Close')}</Button>
              <Button key={1} type="submit" disabled={invalid || submitting}  variant="primary" onClick={handleSubmit}>
                <Icon name={submitting ? 'spinner fa-spin' : 'floppy-o'}/> {_t('Change')}
              </Button>
            </Modal.Footer>
          </Modal>
        ) }
      </SchemaForm>
    )
  }

  render() {
    const { selected, canEdit, fields } = this.props
    const { _t } = app.context

    return (canEdit && fields.length > 0) ? [ (
      <Dropdown.Item key="actions_batch_change" onSelect={(e)=>{ this.setState({ show: true })}} disabled={selected.length == 0}>
        {_t('Batch Change Items')}
      </Dropdown.Item>
    ),
    selected.length > 0 ? this.renderModel() : null
    ] : null
  }

}

export default BatchChangeBtn
