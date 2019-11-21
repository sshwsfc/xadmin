import React from 'react'
import _ from 'lodash'
import { Select } from 'antd'

const FilterEnum = props => {
  const { input: { value, onChange }, field } = props
  const placeholder = field && field.placeholder
  const titleMap = field && field.titleMap

  const selectChange = values => {
    let v = null
    if (values.length > 1) {
      v = { $in: values }
    } else if (values.length > 0) {
      v = values[0]
    }
    onChange(v)
  }
  let seleted = []
  // 初始化value
  if (value && value != '') {
    if (_.isString(value)) seleted = [ value ]
    if (_.isObject(value)) seleted = value.$in
  }
  return (
    <Select
      mode="multiple"
      style={{ width: '100%' }}
      placeholder={placeholder ? placeholder : '请选择'}
      value={seleted}
      onChange={selectChange}
    >
      {titleMap && titleMap.length > 0 && titleMap.map(item => {
        return <Select.Option key={item.value}>{item.name}</Select.Option>
      })}
    </Select>
  )
}

export default FilterEnum

