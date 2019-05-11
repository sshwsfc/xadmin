import React from 'react'
import app from 'xadmin'
import _ from 'lodash'
import { Input, Icon } from 'antd'
const Search = Input.Search

class TextFilter extends React.Component {

  state = { like: true, value: null }

  static getDerivedStateFromProps(props, state) {
    let value = props.input.value
    let like = null

    if(value && value.like !== undefined) {
      value = value.like
      like = true
    } else {
      like = false
    }

    if(state.like != like || state.value != value) {
      return { like, value }
    }
    return null
  }

  componentDidMount() {
    // this.onChange({ ...this.state, like: true })
  }

  onChange = ({ value, like }) => {
    const { onChange } = this.props.input
    if(like) {
      onChange({ like: value })
    } else {
      onChange(value)
    }
  }

  onValueChange = value => {
    const { onChange } = this.props.input
    if(this.state.like) {
      onChange({ like: value })
    } else {
      onChange(value)
    }
  }

  onLikeChange = (like) => {
    const { onChange } = this.props.input
    if(like) {
      onChange({ like: this.state.value })
    } else {
      onChange(this.state.value)
    }
  }

  clear = () => {
    const { onChange } = this.props.input
    this.onValueChange(null)
  }

  render() {
    const { input: { name, onBlur, onChange, ...inputProps }, field } = this.props
    const { like, value } = this.state
    const { _t } = app.context
    const prefix = <Icon type={like ? 'file-search' : 'search'} onClick={()=>this.onLikeChange(!like)} style={{ color: 'rgba(0,0,0,.25)' }} />
    return (
      <Input { ...inputProps} {...field.attrs} value={value} prefix={prefix}
        onChange={e => this.onValueChange(e.target.value)}
      />
    )
  }

}


class SearchTextFilter extends TextFilter {

  render() {
    const { input: { name, onBlur, onChange, ...inputProps }, onSubmit, field, option } = this.props
    const { like, value } = this.state
    const { _t } = app.context
    const prefix = <Icon type={like ? 'file-search' : 'search'} onClick={()=>this.onLikeChange(!like)} style={{ color: 'rgba(0,0,0,.25)' }} />

    return (
      <Search { ...inputProps} {...field.attrs} value={value} prefix={prefix}
        onChange={e => this.onValueChange(e.target.value)}
        onSearch={value => { this.onValueChange(value); onSubmit && onSubmit() }}
      />
    )
  }

}

class SubmitOnChangeWrap extends React.Component {

  state = { value: null, typing: false }

  static getDerivedStateFromProps(props, state) {
    if(!state.typing) {
      return { value: props.input.value }
    }
    return null
  }


  onSubmit = () => {
    this.props.input.onChange(this.state.value)
    this.setState({ typing: false })
  }

  onChange = value => this.setState({ value, typing: true })

  render() {
    const { input, ...props } = this.props
    return <SearchTextFilter input={{ ...input, onChange: this.onChange, value: this.state.value }} {...props} onSubmit={this.onSubmit} />
  }
}

export default ({ option, ...props }) => {
  const submitOnChange = option && option.options && option.options.submitOnChange
  return submitOnChange ? <SubmitOnChangeWrap {...props} option={option} /> : <TextFilter {...props} option={option}/>
}
