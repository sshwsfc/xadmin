import React from 'react'
import _ from 'lodash'
import app from 'xadmin'
import { Button, ButtonGroup } from 'react-bootstrap'

export default class BooleanFilter extends React.Component {

  render() {
    const { input: { name, value, onChange, ...inputProps }, label, meta, field, group: FieldGroup } = this.props
    const { _t } = app.context

    return (
      <FieldGroup label={label} meta={meta} input={this.props.input} field={field}>
        <ButtonGroup {...field.attrs}>
          <Button bsStyle={value === true ? 'success' : 'default'} onClick={()=>{
            onChange(value === true?null:true)
          }}>{field.boolLabel ? field.boolLabel[0] : _t('True')}</Button>
          <Button bsStyle={value === false ? 'success' : 'default'} onClick={()=>{
            onChange(value === false?null:false)
          }}>{field.boolLabel ? field.boolLabel[1] : _t('False')}</Button>
        </ButtonGroup>
      </FieldGroup>
    )
  }

}
