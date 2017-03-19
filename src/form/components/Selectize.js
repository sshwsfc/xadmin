import React from 'react'
import { FormControl } from 'react-bootstrap'

import { SimpleSelect, MultiSelect } from 'react-selectize'
import 'react-selectize/themes/index.css'
import './Selectize.css'

export default ({ input, label, meta, field, group: FieldGroup }) => {

  const onValueChange = (select) => {
    input.onChange(select && select.value)
  }
  const onSelectBlur = ({ originalEvent, value }) => {
    input.onBlur(value && value.value)
  }
  const onSelectFocus = ({ originalEvent, value }) => {
    input.onFocus(value && value.value)
  }

  const options = field.titleMap
  let value = {}
  if(input.value !== undefined && input.value !== null) {
    for(let option of options) {
      if(option.value == input.value) {
        value = { label: option.name || 'null', value: option.value }
        break
      }
    }
  }

  return (
    <FieldGroup label={label} meta={meta} input={input} field={field}>
      <SimpleSelect id={input.name} theme="bootstrap3"
        placeholder={field.description}
        value={value}
        options={options.map(option=>{ return { label: option.name || 'null', value: option.value } })}
        onValueChange={onValueChange}
        onBlur={onSelectBlur}
        onFocus={onSelectFocus}
        {...field.attrs}
      />
    </FieldGroup>
  )
}
