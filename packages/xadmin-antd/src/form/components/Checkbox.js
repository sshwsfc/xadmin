import React from 'react'
import { Checkbox } from 'antd'

export default ({ input, label, meta, field, group: FieldGroup }) => {
  return (
    <FieldGroup label={''} meta={meta} input={input} field={field}>
      <Checkbox checked={!!input.value} {...input} {...field.attrs} >{label}</Checkbox>
    </FieldGroup>
  )
}
