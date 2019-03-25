import React from 'react'
import Select from 'react-select'

export default ({ input, field }) => {

  const onValueChange = (select) => {
    input.onChange(select && select.value)
  }
  const onSelectBlur = ({ originalEvent, value }) => {
    input.onBlur(value && value.value)
  }
  const onSelectFocus = ({ originalEvent, value }) => {
    input.onFocus(value && value.value)
  }

  const options = field.titleMap
  let value = {}
  if(input.value !== undefined && input.value !== null) {
    for(let option of options) {
      if(option.value == input.value) {
        value = { label: option.name != undefined ? option.name : 'null', value: option.value }
        break
      }
    }
  }

  return (
    <Select id={input.name} theme="bootstrap3"
      placeholder={field.description}
      value={value}
      clearable={false}
      options={options.map(option=>{ return { label: option.name != undefined ? option.name : 'null', value: option.value } })}
      onChange={onValueChange}
      onBlur={onSelectBlur}
      onFocus={onSelectFocus}
      {...field.attrs}
    />
  )
}
