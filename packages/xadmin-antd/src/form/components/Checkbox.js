import React from 'react'
import { Checkbox } from 'antd'

export default ({ input, label, field }) => {
  return <Checkbox checked={!!input.value} {...input} {...field.attrs} >{label}</Checkbox>
}
