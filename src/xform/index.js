import React from 'react'
import utils from 'react-schema-form/lib/utils'
import _ from 'lodash'
import {Text, Select} from './widgets'

class XForm extends React.Component {

  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.mapper = {
      number: Text,
      text: Text,
      password: Text,
      textarea: Text,
      select: Select,
      radios: Text,
      date: Text,
      checkbox: Text,
      help: Text,
      array: Text,
      fieldset: Text
    }
  }

  onChange (key, val) {
    // console.log('SchemaForm.onChange', key, val);
    this.props.onModelChange(key, val)
  }

  builder (form, model, index, onChange, mapper) {
    var type = form.type
    let Field = this.mapper[type]
    if (!Field) {
      console.log('Invalid field: \'' + form.key[0] + '\'!')
      return null
    }
    // if (form.condition && eval(form.condition) === false) {
    //   return null
    // }
    return <Field model={model} form={form} key={index} onChange={onChange} mapper={mapper} builder={this.builder}/>
  }

  render () {
    let merged = utils.merge(this.props.schema, this.props.form, this.props.ignore, this.props.option)
    // console.log('SchemaForm merged = ', JSON.stringify(merged, undefined, 2));
    let mapper = this.mapper
    if (this.props.mapper) {
      mapper = _.merge(this.mapper, this.props.mapper)
    }
    let forms = merged.map(function (form, index) {
      return this.builder(form, this.props.model, index, this.onChange, mapper)
    }.bind(this))

    return (
      <form className='form-horizontal'>{forms}</form>
    )
  }
}

module.exports = XForm
