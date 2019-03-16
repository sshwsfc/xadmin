import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Loading } from 'xadmin-layout'
import { convert as schemaConvert } from 'xadmin-form/lib/schema'
import { Card, Row, Col, Form } from 'react-bootstrap'

import { ModelWrap } from '../base'
import { Item } from './Items'

const FieldGroup = ({ label, field, children }) => {
  const groupProps = {}
  const attrs = field.attrs || {}
  const help = field.description || field.help
  const size = (field.option && field.option.groupSize) || attrs.groupSize || { 
    label: {
      sm: 4, md: 3, lg: 2 
    },
    control: {
      sm: 8, md: 9, lg: 10
    }
  }

  if (attrs.size) {
    groupProps['size'] = attrs.size
  }
  if (attrs.variant) {
    groupProps['variant'] = attrs.variant
  }

  const controlComponent = children ? children : (<Form.Control {...attrs} />)
  
  return (
    <Form.Group as={Row} {...groupProps}>
      <Form.Label key={0} column {...size.label}>
        {label}
      </Form.Label>
      <Col key={1} {...size.control}>
        {controlComponent}
        {help && <Form.Text className="text-muted">{help}</Form.Text>}
      </Col>
    </Form.Group>
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
          <Item item={record} field={field.key} inList={false} selected={false} wrap={
            ({ children, ...props })=><div key="value" className="my-1">{children}</div>
          }/>
        </FieldGroup>)
    })
  }

  render() {
    const { title, model, loading, componentClass, ...formProps } = this.props

    return loading ? <Loading/> : 
      (<Form>
        <Card><Card.Body>{this.renderFields()}</Card.Body></Card>
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
