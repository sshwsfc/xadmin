import React from 'react'
import { InputGroup, FormControl, Button } from 'react-bootstrap'
import { FieldGroup } from './base'
import { Icon } from '../../components'

export default React.createClass({

  onBlur(e) {
    const { value, onBlur } = this.props.input
    onBlur({ ...value, text: e.target.value })
  },

  onChange(e) {
    const { value, onChange } = this.props.input
    onChange({ ...value, text: e.target.value })
  },

  onLikeChange(like) {
    const { value, onChange } = this.props.input
    onChange({ ...value, like })
  },

  clear() {
    const { onChange } = this.props.input
    onChange(null)
  },

  render() {
    const { input: { name, value, onBlur, onChange, ...inputProps }, label, meta, field, group: FieldGroup } = this.props
    const { text, like } = value
    return (
      <FieldGroup label={label} meta={meta} input={this.props.input} field={field}>
      <InputGroup { ...field.attrs }>
        <InputGroup.Button>
          <Button active={like} onClick={()=>this.onLikeChange(!like)}><Icon name="magic" /></Button>
        </InputGroup.Button>
        <FormControl type="text" { ...inputProps} {...field.attrs} value={text}
          onBlur={this.onBlur} onChange={this.onChange} />
        <InputGroup.Button>
          <Button onClick={this.clear} style={{ borderLeft: 'none' }}><Icon name="close" /></Button>
        </InputGroup.Button>
      </InputGroup>
      </FieldGroup>
    )
  }

})
