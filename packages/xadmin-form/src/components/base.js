import React from 'react'
import { FormGroup, ControlLabel, FormControl, Col, HelpBlock } from 'react-bootstrap'

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
        {label}{field && field.required ? <span className="text-danger">*</span> : ''}
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

const InlineGroup = ({ label, meta, input, field, children }) => {
  const groupProps = {}
  const attrs = field.attrs || {}
  const error = meta.touched && meta.error
  const help = field.description || field.help

  if (error) {
    groupProps['validationState'] = 'error'
  }
  if (attrs.bsSize) {
    groupProps['bsSize'] = attrs.bsSize
  }
  if (attrs.bsStyle) {
    groupProps['bsStyle'] = attrs.bsStyle
  }

  const controlComponent = children ? children : (<FormControl {...input} {...attrs} placeholder={label} />)
  return (
    <FormGroup controlId={input.name} {...groupProps}>
      <Col sm={12}>
        {controlComponent}
        {help && <HelpBlock>{help}</HelpBlock>}
        {error && <HelpBlock>{error}</HelpBlock>}
      </Col>
    </FormGroup>
    )
}

const SimpleGroup = ({ label, meta, input, field, children }) => {
  const groupProps = {}
  const attrs = field.attrs || {}
  const error = meta.touched && meta.error
  const help = field.description || field.help

  if (error) {
    groupProps['validationState'] = 'error'
  }
  if (attrs.bsSize) {
    groupProps['bsSize'] = attrs.bsSize
  }
  if (attrs.bsStyle) {
    groupProps['bsStyle'] = attrs.bsStyle
  }

  const controlComponent = children ? children : (<FormControl {...input} {...attrs} placeholder={label} />)
  return (
    <FormGroup controlId={input.name} {...groupProps}>
      <ControlLabel>{label}{field && field.required ? <span className="text-danger">*</span> : ''}</ControlLabel>
      {controlComponent}
      {help && <HelpBlock>{help}</HelpBlock>}
      {error && <HelpBlock>{error}</HelpBlock>}
    </FormGroup>
    )
}

export {
  FieldGroup,
  InlineGroup,
  SimpleGroup
}
