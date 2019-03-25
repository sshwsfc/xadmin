import React from 'react'
import { Radio } from 'antd'
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

export default ({ input, field }) => {
  return (
    <RadioGroup
      {...input}
      buttonStyle="solid"
      value={input.value}
      onChange={(event) => { input.onChange(event.target.value) }}
    >
      {field.titleMap.map(option => (<RadioButton value={option.value}>{option.name}</RadioButton>))}
    </RadioGroup>
  )
}
