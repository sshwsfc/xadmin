import React from 'react'
import { Input } from 'antd'

export default ({ input, field }) => {
  return <Input {...input} {...field.attrs} />
}
