import React from 'react'
import { Radio, Button, ButtonToolbar } from 'react-bootstrap'

export default ({ input, field }) => {
  return (
    <ButtonToolbar>
      {field.titleMap.map(option => { 
        return (<Button key={option.value} 
          bsStyle={option.value==input.value?'primary':'default'} active={option.value==input.value} 
          {...input} 
          onClick={()=>{input.onChange(option.value)}}>{option.name}</Button>) 
      })}
    </ButtonToolbar>
  )
}
