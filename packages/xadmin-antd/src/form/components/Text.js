import React from 'react'
import { Input } from 'antd'

export default ({ input, label, meta, field, group: FieldGroup }) => {
  return (
    <FieldGroup label={label} meta={meta} input={input} field={field}>
      <Input {...input} {...field.attrs} />
    </FieldGroup>
  )
}
