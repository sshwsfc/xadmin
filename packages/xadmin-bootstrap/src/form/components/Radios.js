import React from 'react'
import { Radio } from 'react-bootstrap'

export default ({ input, field }) => {
  const inline = field.attrs !== undefined && !!field.attrs.inline
  return field.titleMap.map(option => { return (<Radio key={option.value} checked={option.value==input.value} inline={inline} {...input} value={option.value}> {option.name}</Radio>) })
}
