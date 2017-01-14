import React from 'react'
import _ from 'lodash'
import { Field } from 'redux-form'
import { FieldGroup } from './base'
import { FormControl, InputGroup, Button } from 'react-bootstrap'
import { Icon } from '../../components'

export default React.createClass({

  getInitialState() {
    const value = this.props.input.value
    if(typeof value == 'string') {
      return { eq: value }
    } else {
      return { ...value }
    }
  },

  getValue() {
    const { eq, ...ops } = this.state
    if(eq) {
      return eq
    } else {
      const ret = _.pickBy(ops, (v) => {
        return !_.isNil(v) && v != ''
      })
      return Object.keys(ret).length > 0 ? ret : null
    }
  },

  onBlur(e, key) {
    const { onBlur } = this.props.input
    this.setState({ [key]: e.target.value }, (()=>{
      onBlur(this.getValue())
    }).bind(this))
  },

  onChange(e, key) {
    const { onChange } = this.props.input
    this.setState({ [key]: e.target.value }, (()=>{
      onChange(this.getValue())
    }).bind(this))
  },

  clear() {
    const { onChange } = this.props.input
    this.setState({ }, (()=>{
      onChange(this.getValue())
    }).bind(this))
  },

  shouldComponentUpdate(nextProps) {
    return this.props != nextProps
  },

  render() {
    const { input: { name, value, onBlur, onChange, ...inputProps }, label, meta: { touched, error }, field, group: FieldGroup } = this.props
    const { gte, lte } = this.state
    return (
      <FieldGroup
        label={label}
        error={touched && error}
        input={this.props.input} field={field} >
        <InputGroup>
          <FormControl type="number" { ...inputProps} {...field.attrs} value={gte}
            placeholder={field.minimum ? `Minimum(${field.minimum})` : 'No limit'}
            onBlur={(e)=>this.onBlur(e, 'gte')} onChange={(e)=>this.onChange(e, 'gte')} />
          <InputGroup.Addon>to</InputGroup.Addon>
          <FormControl type="number" { ...inputProps} {...field.attrs} value={lte}
            placeholder={field.maximum ? `Maximum(${field.maximum})` : 'No limit'}
            onBlur={(e)=>this.onBlur(e, 'lte')} onChange={(e)=>this.onChange(e, 'lte')} />
        </InputGroup>
      </FieldGroup>
    )
  }

})
