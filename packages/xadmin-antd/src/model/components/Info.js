import React from 'react'
import _ from 'lodash'
import { Loading } from 'xadmin-ui'
import { convert as schemaConvert } from 'xadmin-form/lib/schema'
import { Form, Card } from 'antd'
import { Item } from './Items'
import { use } from 'xadmin'

const FieldGroup = ({ label, field, children }) => {
  const attrs = field.attrs || {}
  const extra = field.description || field.help
  const size = (field.option && field.option.groupSize) || attrs.groupSize || { 
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 }
    }
  }

  const groupProps = { extra, ...size, required: field.required }
  return (
    <Form.Item label={label} {...groupProps}>
      {children}
    </Form.Item>
  )
}

const ModelInfo = ({ data, title, schema, model, loading, saveItem, ...formProps }) => {

  const renderFields = () => {
    return schemaConvert(model).fields.map(field => {
      field.option = { ...field.option, ...formProps }
      return (
        <FieldGroup key={field.key} label={field.label} field={field}>
          <Item item={data} field={field.key} value={data[field.key]} inList={false} selected={false} wrap={
            ({ children })=> children
          }/>
        </FieldGroup>)
    })
  }

  return loading ? <Loading/> : 
    (<Form>
      <Card>{renderFields()}</Card>
    </Form>)
}

export default (props) => <ModelInfo {...use('model.get', props)} />
