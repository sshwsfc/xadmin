import React from 'react'
import _ from 'lodash'
import { Loading } from 'xadmin-ui'
import { SchemaForm } from 'xadmin-form'
import { ModelWrap } from 'xadmin-model'

class ModelForm extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      record: _.omitBy({ ...this.props.data }, _.isNil)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.setState({ record: _.omitBy({ ...nextProps.data }, _.isNil) })
    }
  }

  render() {
    const { title, schema, model, loading, saveItem, ...formProps } = this.props
    return loading ? <Loading /> : 
      (<SchemaForm 
        formKey={`model.${model.key}`}
        schema={schema || model}
        initialValues={this.state.record}
        onSubmit={(values) => saveItem(values)}
        {...formProps}
        {...model.formProps} />
      )
  }

}

export default ModelWrap('model.item')(ModelForm)
