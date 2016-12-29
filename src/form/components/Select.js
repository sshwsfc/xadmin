import React from 'react'
import { Field } from 'redux-form'
import { FieldGroup } from './base'
import { FormControl } from 'react-bootstrap'

export default ({ input, label, meta: { touched, error }, field }) => {
  return (
    <FieldGroup
      id={input.name}
      label={label}
      error={touched && error}
      help={field.description || field.help}
      control={{ ...field.attrs }}
      >
      <FormControl componentClass="select" 
        {...input} >
        {[ { name: '----', value: null }, ...field.titleMap ].map(option => { return (<option key={option.name} value={option.value}>{option.name}</option>) })}
      </FormControl>
    </FieldGroup>
  )
}
