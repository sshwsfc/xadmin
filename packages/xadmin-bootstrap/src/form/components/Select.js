import React from 'react'
import { Form } from 'react-bootstrap'

export default ({ input, label, meta, field, group: FieldGroup }) => {
  return (
    <FieldGroup label={label} meta={meta} input={input} field={field}>
      <Form.Control as="select" {...input} >
        {[ { name: '----', value: '' }, ...field.titleMap ].map(option => { return (<option key={option.name} value={option.value}>{option.name}</option>) })}
      </Form.Control>
    </FieldGroup>
  )
}
