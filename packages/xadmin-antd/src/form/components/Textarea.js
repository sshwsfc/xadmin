import React from 'react'
import { Input } from 'antd'
const { TextArea } = Input

export default ({ input, field }) => {
  return <TextArea autosize={true} rows={4} {...input} {...field.attrs} />
}
