import React from 'react'
import { Input } from 'antd'
const { TextArea } = Input

export default ({ input, label, meta, field, group: FieldGroup }) => {
  return (
    <FieldGroup label={label} meta={meta} input={input} field={field}>
      <TextArea autosize={true} rows={4} {...input} {...field.attrs} />
    </FieldGroup>
  )
}
