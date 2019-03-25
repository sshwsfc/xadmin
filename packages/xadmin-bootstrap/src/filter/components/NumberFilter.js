import React from 'react'
import _ from 'lodash'
import app from 'xadmin'
import { FormControl, InputGroup } from 'react-bootstrap'

export default class NumberFilter extends React.Component {

  constructor(props, context) {
    super(props, context)
    const value = props.input.value
    if(typeof value == 'string') {
      this.state = { eq: value }
    } else {
      this.state = { ...value }
    }
  }

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
  }

  onBlur = (e, key) => {
    const { onBlur } = this.props.input
    this.setState({ [key]: e.target.value }, ()=>{
      onBlur(this.getValue())
    })
  }

  onChange = (e, key) => {
    const { onChange } = this.props.input
    this.setState({ [key]: e.target.value }, ()=>{
      onChange(this.getValue())
    })
  }

  clear = () => {
    const { onChange } = this.props.input
    this.setState({ }, ()=>{
      onChange(this.getValue())
    })
  }

  shouldComponentUpdate(nextProps) {
    return this.props != nextProps
  }

  render() {
    const { input: { name, value, onBlur, onChange, ...inputProps }, field } = this.props
    const { gte, lte } = this.state
    const { _t } = app.context
    return (
      <InputGroup>
        <FormControl type="number" { ...inputProps} {...field.attrs} value={gte || ''}
          placeholder={field.minimum ? `Minimum(${field.minimum})` : _t('No limit')} style={{ flexGrow: 3 }}
          onBlur={(e)=>this.onBlur(e, 'gte')} onChange={(e)=>this.onChange(e, 'gte')} />
        <FormControl value="~" style={{ textAlign: 'center' }} {...field.attrs} readOnly />          
        <FormControl type="number" { ...inputProps} {...field.attrs} value={lte || ''}
          placeholder={field.maximum ? `Maximum(${field.maximum})` : _t('No limit')} style={{ flexGrow: 3 }}
          onBlur={(e)=>this.onBlur(e, 'lte')} onChange={(e)=>this.onChange(e, 'lte')} />
      </InputGroup>
    )
  }

}
