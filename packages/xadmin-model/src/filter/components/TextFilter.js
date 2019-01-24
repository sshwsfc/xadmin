import React from 'react'
import app from 'xadmin'
import { InputGroup, FormControl, Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FieldGroup } from './base'
import Icon from 'react-fontawesome'

export default class TextFilter extends React.Component {

  onBlur = (e) => {
    const { value, onBlur } = this.props.input
    if(e.target.value && value.like) {
      onBlur({ like: e.target.value })
    } else {
      onBlur(e.target.value)
    }
  }

  onChange = (e) => {
    const { value, onChange } = this.props.input
    if(e.target.value && value.like) {
      onChange({ like: e.target.value })
    } else {
      onChange(e.target.value)
    }
  }

  onLikeChange = (like) => {
    const { value, onChange } = this.props.input
    if(!value) {
      return
    }
    if(value.like && !like) {
      onChange(value.like)
    } else if(_.isString(value) && like) {
      onChange({ like: value })
    }
  }

  clear = () => {
    const { onChange } = this.props.input
    onChange(null)
  }

  render() {
    const { input: { name, value, onBlur, onChange, ...inputProps }, label, meta, field, group: FieldGroup } = this.props
    let text = value
    let like = false
    if(value.like) {
      text = value.like
      like = true
    }
    const { _t } = app.context

    return (
      <FieldGroup label={label} meta={meta} input={this.props.input} field={field}>
        <InputGroup { ...field.attrs }>
          <InputGroup.Button>
            <OverlayTrigger placement="top" overlay={<Tooltip>{like ? _t('Fuzzy query') : _t('Exact query')}</Tooltip>}>
              <Button disabled={!text} onClick={()=>this.onLikeChange(!like)}>
                {like ? <Icon name="magic" /> : <Icon name="search" /> }
              </Button>
            </OverlayTrigger>
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

}
