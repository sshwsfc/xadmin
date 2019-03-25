import React from 'react'
import app from 'xadmin'
import _ from 'lodash'
import { Input, Icon } from 'antd'
const Search = Input.Search

export default class TextFilter extends React.Component {

  state = { like: true, value: '' }

  // static getDerivedStateFromProps(props, state) {
  //   let value = props.input.value
  //   let like = null

  //   if(value && value.like) {
  //     value = value.like
  //     like = true
  //   } else {
  //     like = false
  //   }

  //   if(state.like != like || state.value != value) {
  //     return { like, value }
  //   }
  //   return null
  // }

  onChange = () => {
    const { onChange } = this.props.input
    const { value, like } = this.state
    if(like) {
      onChange({ 'like': value })
    } else {
      onChange(value)
    }
  }

  onValueChange = value => {
    this.setState({ value }, () => {
      const option = this.props.option
      if(!(option && option.options && option.options.submitOnChange)) {
        this.onChange()
      }
    })
  }

  onLikeChange = (like) => {
    this.setState({ like }, () => {
      const option = this.props.option
      if(!(option && option.options && option.options.submitOnChange)) {
        this.onChange()
      }
    })
  }

  clear = () => {
    const { onChange } = this.props.input
    this.onValueChange(null)
  }

  render() {
    const { input: { name, onBlur, onChange, ...inputProps }, field, option } = this.props
    const { like, value } = this.state
    const { _t } = app.context
    const submitOnChange = option && option.options && option.options.submitOnChange
    const prefix = <Icon type={like ? 'file-search' : 'search'} onClick={()=>this.onLikeChange(!like)} style={{ color: 'rgba(0,0,0,.25)' }} />

    return submitOnChange ? (
      <Search { ...inputProps} {...field.attrs} value={value} prefix={prefix}
        onChange={e => this.onValueChange(e.target.value)}
        onSearch={value => { this.onValueChange(value); this.onChange() }}
      />
    ) : (
      <Input { ...inputProps} {...field.attrs} value={value} prefix={prefix}
        onChange={e => this.onValueChange(e.target.value)}
      />
    )
  }

}
