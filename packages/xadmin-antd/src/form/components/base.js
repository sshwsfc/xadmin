import React from 'react'
import { Form, Input } from 'antd'

const FieldGroup = ({ label, meta, input, field, children }) => {
  const attrs = field.attrs || {}
  const error = meta.touched && meta.error
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

  if (error) {
    groupProps['validateStatus'] = 'error'
    groupProps['hasFeedback'] = true
    groupProps['help'] = error
  }


  const controlComponent = children ? children : (<Input {...input} {...attrs} />)
  return (
    <Form.Item label={label} {...groupProps}>
      {controlComponent}
    </Form.Item>
  )
}

const FieldTableGroup = ({ label, meta, input, field, nav, children }) => {
  const attrs = field.attrs || {}
  const error = meta.touched && meta.error
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

  if (error) {
    groupProps['validateStatus'] = 'error'
    groupProps['hasFeedback'] = true
    groupProps['help'] = error
  }


  const controlComponent = children ? children : (<Input {...input} {...attrs} />)
  return (
    <>
      <Form.Item label={label} {...groupProps}>
        {nav}
      </Form.Item>
      {controlComponent}
    </>
  )
}

export {
  FieldGroup, FieldTableGroup
}
