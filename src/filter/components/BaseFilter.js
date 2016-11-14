import React from 'react'
import _ from 'lodash'
import { Field } from 'redux-form'
import { FieldGroup } from './base'
import { FormControl, Checkbox } from 'react-bootstrap'

export default React.createClass({

  getInitialState() {
    const value = this.props.input.value
  },

  getValue() {
    const { value } = this.state
  },

  onChange(e) {
    const { onChange } = this.props.input
    this.setState({ value: [] }, (()=>{
      onChange(this.getValue())
    }).bind(this))
  },

  clear() {
    const { onChange } = this.props.input
    this.setState({ value: [] }, (()=>{
      onChange(this.getValue())
    }).bind(this))
  },

  shouldComponentUpdate(nextProps) {
    return this.props != nextProps
  },

  render() {
    const { input: { name, value, onBlur, onChange, ...inputProps }, label, meta: { touched, error }, field } = this.props
    const { newValue } = this.state
    return (
      <FieldGroup
        id={name}
        label={label}
        error={error}
        help={field.description || field.help}
        control={{ ...field.attrs }} >
        
      </FieldGroup>
    )
  }

})
