import React from 'react'
import _ from 'lodash'
import { Loading } from 'xadmin-ui'
import { SchemaForm } from 'xadmin-form'
import { use } from 'xadmin'

const ModelForm = props => {
  const { data, title, schema, model, loading, saveItem, ...formProps } = use('model.item', props)
  return loading ? <Loading /> : 
    (<SchemaForm 
      formKey={`model.${model.key}`}
      schema={schema || model}
      initialValues={data}
      onSubmit={saveItem}
      {...formProps}
      {...model.formProps} />
    )
}

export default ModelForm
