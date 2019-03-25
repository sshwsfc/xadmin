import React from 'react'
import { Select } from 'antd'
const Option = Select.Option

export default ({ input, field }) => {
  return (
    <Select loading={field.titleMap} {...input}>
      {[ { name: '----', value: '' }, ...field.titleMap ].map(option => { return (<Option key={option.value} value={option.value}>{option.name}</Option>) })}
    </Select>
  )
}
