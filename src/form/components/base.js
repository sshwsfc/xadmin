import React from 'react'
import { FormGroup, ControlLabel, FormControl, Col, HelpBlock } from 'react-bootstrap'
import { FormWrap } from '../base'

const FieldGroup = ({ id, label, help, error, control, children, groupSize }) => {
  let groupProps = {}
  const size = groupSize || { label: 2, field: 10 }
  if (error) {
    groupProps['validationState'] = 'error'
  }
  if(control.bsSize) {
    groupProps['bsSize'] = control.bsSize
    delete control['bsSize']
  }
  if(control.bsStyle) {
    groupProps['bsStyle'] = control.bsStyle
    delete control['bsStyle']
  }
  const controlComponent = children ? children : (<FormControl {...control} />)
  return (
    <FormGroup controlId={id} {...groupProps}>
      <Col key={0} componentClass={ControlLabel} sm={size.label}>
        {label}
      </Col>
      <Col key={1} sm={size.field}>
        {controlComponent}
        <FormControl.Feedback />
        {help && <HelpBlock>{help}</HelpBlock>}
        {error && <HelpBlock>{error}</HelpBlock>}
      </Col>
    </FormGroup>
    )
}

export default {
  FieldGroup: FormWrap('form.fieldgroup')(FieldGroup)
}
