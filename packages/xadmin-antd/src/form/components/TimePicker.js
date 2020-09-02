import React from 'react'
import { TimePicker } from 'antd'
import moment from 'moment'

export default ({ input: { onChange, value, ...inputProp }, field }) => {
  const format = field.timeFormat || 'HH:mm:ss'
  const onTimeChange = value => {
    onChange(value && value.format(format))
  }
  return <TimePicker allowClear onChange={onTimeChange} value={value?moment(value, format): null} {...inputProp} />
}
