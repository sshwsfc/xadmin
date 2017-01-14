import React from 'react'
import _ from 'lodash'
import { Field } from 'redux-form'
import { FieldGroup } from './base'
import { FormControl, Checkbox } from 'react-bootstrap'

export default React.createClass({

  getInitialState() {
    const value = this.props.input.value
    // like
    if(value) {
      if(typeof value == 'string') {
        return { checks: [ value ] }
      } else {
        return { checks: [ ...value['inq'] ] }
      }
    } else {
      return { checks: [] }
    }
  },

  getValue(e) {
    const { checks } = this.state
    if(checks.length > 1) {
      return { inq: checks }
    } else if(checks.length > 0) {
      return checks[0]
    } else {
      return null
    }
  },

  onChange(e, value) {
    const { onChange } = this.props.input
    const { checks } = this.state
    let newChecks = checks
    if(e.target.checked) {
      if(checks.indexOf(value) == -1) {
        newChecks = [ ...checks, value ]
      }
    } else {
      if(checks.indexOf(value) >= 0) {
        newChecks = [ ..._.pull(checks, value) ]
      }
    }
    if(newChecks != checks) {
      this.setState({ checks: newChecks }, (()=>{
        onChange(this.getValue())
      }).bind(this))
    }
  },

  clear() {
    const { onChange } = this.props.input
    this.setState({ checks: [] }, (()=>{
      onChange(this.getValue())
    }).bind(this))
  },

  shouldComponentUpdate(nextProps) {
    return this.props != nextProps
  },

  render() {
    const { input: { name, value, onBlur, onChange, ...inputProps }, label, meta: { touched, error }, field, group: FieldGroup } = this.props
    const { checks } = this.state
    const inline = true
    return (
      <FieldGroup
        label={label}
        error={touched && error}
        input={this.props.input} field={field} >
        <Checkbox key="check-clear" 
          checked={checks.length==0} 
          onChange={(e)=>{
            if(e.target.checked) {
              this.clear()
            }
          }}
          inline={inline} {...inputProps}> All</Checkbox>
      {field.titleMap.map(option => { return (
        <Checkbox key={option.name} 
          checked={checks.indexOf(option.value) >= 0} 
          onChange={(e)=>this.onChange(e, option.value)}
          inline={inline} {...inputProps} value={option.value}> {option.name}</Checkbox>) })}
      </FieldGroup>
    )
  }

})
