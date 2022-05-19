import React from 'react'
import _ from 'lodash'
import { Loading } from 'xadmin-ui'
import { SchemaForm } from 'xadmin-form'
import { use } from 'xadmin'

const ModelForm = props => {
  const { title, schema, ...formProps } = props
  const { model } = use('model')
  const { data, loading, saveItem } = use('model.item', props)
  return loading ? <Loading /> : 
    (<SchemaForm 
      formKey={`model.${model.key}`}
      schema={schema || model}
      initialValues={data}
      onSubmit={(item) => saveItem(item)}
      {...formProps}
      {...model.formProps} />
    )
}

export default ModelForm
