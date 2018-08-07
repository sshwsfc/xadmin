import React from 'react'
import _ from 'lodash'
import { FormGroup, ControlLabel, FormControl, Col, HelpBlock, ButtonGroup, Modal, OverlayTrigger, Popover, Panel, Button, Label, Well, MenuItem, ListGroup, ListGroupItem } from 'react-bootstrap'
import { SchemaForm, FormWrap } from 'xadmin-form'

import { app } from 'xadmin'
import { ModelWrap, Model } from '../index'
import { BaseRow, List } from '../components/Items'

import Icon from 'react-fontawesome'

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

  if(meta.dirty) {
    groupProps['validationState'] = 'success'
  }
  if (error) {
    groupProps['validationState'] = 'error'
  }
  if (attrs.bsSize) {
    groupProps['bsSize'] = attrs.bsSize
  }
  if (attrs.bsStyle) {
    groupProps['bsStyle'] = attrs.bsStyle
  }

  const controlComponent = children ? children : (<FormControl {...input} {...attrs} />)
  return (
    <FormGroup controlId={input.name} {...groupProps}>
      <Col key={0} componentClass={ControlLabel} {...size.label}>
        {label}
      </Col>
      <Col key={1} {...size.control}>
        {controlComponent}
        <FormControl.Feedback />
        {help && <HelpBlock>{help}</HelpBlock>}
        {error && <HelpBlock>{error}</HelpBlock>}
      </Col>
    </FormGroup>
  )
}

@ModelWrap('actons.batch_change')
@ModelWrap('model.list.actions')
class BatchChangeBtn extends React.Component {

  state = { show: false }

  onClose = () => {
    this.setState({ show: false })
  }

  onBatchChange(value) {
    this.props.onBatchChange(value)
    this.onClose()
  }

  renderModel() {
    const { selected, model, fields, location } = this.props
    const { _t } = app.context
    const show = this.state.show

    const FormLayout = (props) => {
      const { children, invalid, handleSubmit, submitting, onClose } = props
      const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
      return (
        <Modal show={show} onHide={this.onClose}>
          <Modal.Header closeButton>
            <Modal.Title>{_t('Please input the value to batch change items')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="form-horizontal" onSubmit={handleSubmit}>{children}</form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={onClose}>{_t('Close')}</Button>
            <Button type="submit" disabled={invalid || submitting}  bsStyle="primary" onClick={handleSubmit}><Icon name={icon}/> {_t('Change')}</Button>
          </Modal.Footer>
        </Modal>
      )
    }

    return (
      <SchemaForm formKey={`model_batch.${model.key}`} 
        schema={_.omit({
          ...model,
          properties: _.pick(model.properties, fields),
          form: model.form !== undefined ? model.form.filter(obj => {
            return obj == '*' || fields.indexOf(obj) >= 0 || fields.indexOf(obj.key) >= 0 }) : [ '*' ]
        }, 'required')}
        option={{ group: FieldGroup }}
        onSubmit={this.onBatchChange.bind(this)}
        onClose={this.onClose}
        component={FormLayout}/>
    )
  }

  render() {
    const { selected, onSelect, canEdit, fields } = this.props
    const { _t } = app.context

    return (canEdit && fields.length > 0) ? [ (
      <MenuItem eventKey={'actions_batch_change'} onSelect={(e)=>{onSelect(e); this.setState({ show: true })}} disabled={selected.length == 0}>
        {_t('Batch Change Items')}
      </MenuItem>
    ),
    (this.state.show && selected.length > 0) ? this.renderModel() : null
    ] : null
  }

}

export default BatchChangeBtn
