import React from 'react'
import _ from 'lodash'
import { Form, Input, Col } from 'antd'

const FieldGroup = ({ label, meta, input, field, tailLayout, children }) => {
  const attrs = field.attrs || {}
  const error = meta.touched && (meta.error || meta.submitError)
  const extra = field.description || field.help
  const size = (field.option && field.option.groupSize) || attrs.groupSize || { 
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 19,  offset: tailLayout ? 5 : 0 }
    }
  }

  const groupProps = { extra, ...size, required: field.required }

  if (error) {
    groupProps['validateStatus'] = 'error'
    groupProps['hasFeedback'] = true
    if(_.isString(error)) {
      groupProps['help'] = error
    }
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
  const error = meta.touched && (meta.error || meta.submitError)
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

const InlineGroup = ({ label, meta, input, field, children }) => {
  const attrs = field.attrs || {}
  const error = meta.touched && (meta.error || meta.submitError)
  const extra = field.description || field.help
  const groupProps = { extra, required: field.required }

  if (error) {
    groupProps['validateStatus'] = 'error'
    groupProps['hasFeedback'] = true
    groupProps['help'] = error
  }

  const controlComponent = children ? children : (<Input {...input} {...attrs} />)
  return (
    <Form.Item {...groupProps}>
      {React.cloneElement(controlComponent, { inline: true } )}
    </Form.Item>
  )
}

const SimpleGroup = ({ label, meta, input, field, children }) => {
  const attrs = field.attrs || {}
  const error = meta.touched && (meta.error || meta.submitError)
  const extra = field.description || field.help
  const groupProps = { extra, required: field.required }

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

const ColGroup = ({ label, meta, input, field, children }) => {
  const attrs = field.attrs || {}
  const error = meta.touched && (meta.error || meta.submitError)
  const extra = field.description || field.help
  const size = (field.option && field.option.groupSize) || attrs.groupSize || { 
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
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
    <Col span={8} xs={24} sm={12} md={12} lg={8} xl={8} xxl={6}>
      <Form.Item label={label} {...groupProps}>
        {controlComponent}
      </Form.Item>
    </Col>
  )
}

export {
  FieldGroup, FieldTableGroup, InlineGroup, ColGroup, SimpleGroup
}
