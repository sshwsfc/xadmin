import React from 'react'
import { Field } from 'redux-form'
import { FieldGroup } from './base'
import { Radio, Button, ButtonToolbar } from 'react-bootstrap'

export default ({ input, label, meta: { touched, error }, field }) => {
  return (
    <FieldGroup
      id={input.name}
      label={label}
      error={touched && error}
      help={field.description || field.help}
      control={{ ...field.attrs }}
      >
      <ButtonToolbar>
      {field.titleMap.map(option => { 
        return (<Button key={option.value} 
          bsStyle={option.value==input.value?'primary':'default'} active={option.value==input.value} 
          {...input} 
          onClick={()=>{input.onChange(option.value)}}>{option.name}</Button>) 
      })}
      </ButtonToolbar>
    </FieldGroup>
  )
}
