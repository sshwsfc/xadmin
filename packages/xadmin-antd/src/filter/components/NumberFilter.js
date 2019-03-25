import React from 'react'
import _ from 'lodash'
import app from 'xadmin'
import { InputNumber } from 'antd'

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
    const { onChange } = this.props.input
    this.setState({ [key]: e.target.value }, ()=>{
      onChange(this.getValue())
    })
  }

  onChange = (value, key) => {
    const { onChange } = this.props.input
    this.setState({ [key]: value }, ()=>{
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
      <div style={{ display: 'inline-flex' }}>
        <InputNumber { ...inputProps} {...field.attrs} style={{ width: 'auto', ...field.style }} value={gte || ''}
          placeholder={field.minimum ? `Minimum(${field.minimum})` : _t('No limit')}
          onChange={(v)=>this.onChange(v, 'gte')} />
        <span style={{ textAlign: 'center', width: '2rem' }}>~</span>
        <InputNumber { ...inputProps} {...field.attrs} style={{ width: 'auto', ...field.style }} value={lte || ''}
          placeholder={field.maximum ? `Maximum(${field.maximum})` : _t('No limit')}
          onChange={(v)=>this.onChange(v, 'lte')} />
      </div>
    )
  }

}
