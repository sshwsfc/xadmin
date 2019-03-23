import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Loading } from 'xadmin-ui'
import { convert as schemaConvert } from 'xadmin-form/lib/schema'
import { ModelWrap } from 'xadmin-model'
import { Form, Card } from 'antd'
import { Item } from './Items'

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

class ModelInfo extends React.Component {

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
    if (this.props.id !== nextProps.id) {
      this.props.getItem(nextProps.id)
    }
  }

  renderFields() {
    const { title, model, ...formProps } = this.props
    const record = this.state.record

    return schemaConvert(model).fields.map(field => {
      field.option = { ...field.option, ...formProps }
      return (
        <FieldGroup key={field.key} label={field.label} field={field}>
          <Item item={record} field={field.key} value={record[field.key]} inList={false} selected={false} wrap={
            ({ children, ...props })=> children
          }/>
        </FieldGroup>)
    })
  }

  render() {
    const { title, model, loading, componentClass, ...formProps } = this.props

    return loading ? <Loading/> : 
      (<Form>
        <Card>{this.renderFields()}</Card>
      </Form>)
  }

}
ModelInfo.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object,
  loading: PropTypes.bool,
  model: PropTypes.object.isRequired,
  getItem: PropTypes.func.isRequired
}

export default ModelWrap('model.item')(ModelInfo)
