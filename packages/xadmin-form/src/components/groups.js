import React from 'react'
import { Form, Col, Row } from 'react-bootstrap'

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

const InLineRow = ({ children }) => <Col sm={6} md={4} lg={3}><Row className="mb-2">{children}</Row></Col>

const InlineGroup = ({ label, meta, input, field, children }) => {
  const groupProps = {}
  const attrs = field.attrs || {}
  const error = meta.touched && meta.error
  const help = field.description || field.help

  if (attrs.size) {
    groupProps['size'] = attrs.size
  }
  if (attrs.variant) {
    groupProps['variant'] = attrs.variant
  }

  const controlComponent = children ? children : (<Form.Control {...input} {...attrs} placeholder={label} />)
  return (
    <Form.Group as={InLineRow} controlId={input.name} {...groupProps}>
      <Col sm={3}>
        <Form.Label>
          {label}{field && field.required ? <span className="text-danger">*</span> : ''}
        </Form.Label>
      </Col>
      <Col sm={9}>
        {controlComponent}
        {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
        {help && <Form.Text className="text-muted">{help}</Form.Text>}
      </Col>
    </Form.Group>
  )
}

const SimpleGroup = ({ label, meta, input, field, children }) => {
  const groupProps = {}
  const attrs = field.attrs || {}
  const error = meta.touched && meta.error
  const help = field.description || field.help

  if (attrs.size) {
    groupProps['size'] = attrs.size
  }
  if (attrs.variant) {
    groupProps['variant'] = attrs.variant
  }

  const controlComponent = children ? children : (<Form.Control {...input} {...attrs} placeholder={label} />)
  return (
    <Form.Group controlId={input.name} {...groupProps}>
      <Form.Label>
        {label}{field && field.required ? <span className="text-danger">*</span> : ''}
      </Form.Label>
      {controlComponent}
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
      {help && <Form.Text className="text-muted">{help}</Form.Text>}
    </Form.Group>
  )
}

export {
  FieldGroup,
  InlineGroup,
  SimpleGroup
}
