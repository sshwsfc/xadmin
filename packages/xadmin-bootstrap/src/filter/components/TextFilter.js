import React from 'react'
import app from 'xadmin'
import _ from 'lodash'
import { InputGroup, Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
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
          <InputGroup.Prepend>
            <OverlayTrigger placement="top" overlay={<Tooltip>{like ? _t('Fuzzy query') : _t('Exact query')}</Tooltip>}>
              <Button variant="outline-secondary" disabled={!text} onClick={()=>this.onLikeChange(!like)}>
                {like ? <Icon name="magic" /> : <Icon name="search" /> }
              </Button>
            </OverlayTrigger>
          </InputGroup.Prepend>
          <Form.Control type="text" { ...inputProps} {...field.attrs} value={text}
            onBlur={this.onBlur} onChange={this.onChange} />
          <InputGroup.Append>
            <Button variant="outline-secondary" onClick={this.clear} style={{ borderLeft: 'none' }}><Icon name="close" /></Button>
          </InputGroup.Append>
        </InputGroup>
      </FieldGroup>
    )
  }

}
