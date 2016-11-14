import React from 'react'
import { FormGroup, ControlLabel, FormControl, Col, HelpBlock } from 'react-bootstrap'

const FieldGroup = ({ id, label, help, error, control, children }) => {
  let groupProps = {}
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
      <Col key={0} componentClass={ControlLabel} sm={2}>
        {label}
      </Col>
      <Col key={1} sm={10}>
        {controlComponent}
        <FormControl.Feedback />
        {help && <HelpBlock>{help}</HelpBlock>}
        {error && <HelpBlock>{error}</HelpBlock>}
      </Col>
    </FormGroup>
    )
}

export default {
  FieldGroup
}
