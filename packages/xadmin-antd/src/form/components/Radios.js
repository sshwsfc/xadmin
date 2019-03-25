import React from 'react'
import { Radio } from 'antd'
const RadioGroup = Radio.Group

export default ({ input, field }) => {
  return (
    <RadioGroup {...input} value={input.value} onChange={(event) => { input.onChange(event.target.value) }} >
      {field.titleMap.map(option => (<Radio value={option.value} checked={option.value == input.value}>{option.name}</Radio>))}
    </RadioGroup>
  )
}
