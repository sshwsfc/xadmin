import React from 'react'
import { FormGroup, ControlLabel, FormControl, Col, HelpBlock } from 'react-bootstrap'

const FieldGroup = ({ id, label, help, meta, control, children }) => {
  let groupProps = {}
  const error = meta.touched && meta.error
  if (error) {
    groupProps['validationState'] = 'error'
  }
  const { bsSize, bsStyle, groupComponent, ...controlProps } = control
  if(bsSize) {
    groupProps['bsSize'] = bsSize
  }
  if(bsStyle) {
    groupProps['bsStyle'] = bsStyle
  }
  const controlComponent = children ? children : (<FormControl {...controlProps} />)
  if(groupComponent) {
    const GroupComponent = groupComponent
    return (<GroupComponent id={id} groupProps={groupProps} {...{ label, help, meta }} >{controlComponent}</GroupComponent>)
  } else {
    return (
      <FormGroup controlId={id} {...groupProps}>
        <Col key={0} componentClass={ControlLabel} sm={3}>
          {label}
        </Col>
        <Col key={1} sm={9}>
          {controlComponent}
          <FormControl.Feedback />
          {help && <HelpBlock>{help}</HelpBlock>}
          {error && <HelpBlock>{error}</HelpBlock>}
        </Col>
      </FormGroup>
    )
  }
}

export {
  FieldGroup
}
