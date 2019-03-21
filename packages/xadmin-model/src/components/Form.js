import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Icon from 'react-fontawesome'
import app from 'xadmin'
import { Loading } from 'xadmin-ui'
import { SchemaForm } from 'xadmin-form'

import { OverlayTrigger, Tooltip, Card, Form, Row, Col, Button } from 'react-bootstrap'
import { ModelWrap } from '../base'

const DefaultLayout = (props) => {
  const { children, invalid, handleSubmit, submitting } = props
  const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
  const { _t } = app.context
  return (
    <Form onSubmit={handleSubmit}>
      <Card className="mt-3 mb-3" body>
        {children}
        <Form.Group as={Row} className="mt-5">
          <Col sm={{ span: 10, offset: 2 }}>
            {invalid ? (
              <OverlayTrigger placement="top" overlay={<Tooltip>{_t('Please be sure to complete all field')}</Tooltip>}>
                <Button key={0} type="submit" disabled={submitting} onClick={handleSubmit} variant="primary">
                  <Icon name="ban"/> {_t('Save')}</Button>
              </OverlayTrigger>
            ) : (
              <Button key={0} type="submit" disabled={submitting} onClick={handleSubmit} variant="primary">
                <Icon name={icon}/> {_t('Save')}</Button>
            )} {' '}
            <Button key={1} onClick={()=>history.back()} variant="light">{_t('Cancel')}</Button>
          </Col>
        </Form.Group>
      </Card>
    </Form>
  )
}

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
    const { title, schema, model, loading, saveItem, componentClass, ...formProps } = this.props
    const FormLayout = componentClass || DefaultLayout
    return loading ? <Loading /> : 
      (<SchemaForm 
        formKey={`model.${model.key}`}
        schema={schema || model}
        initialValues={this.state.record}
        onSubmit={(values) => saveItem(values)}
        component={FormLayout}
        {...formProps}
        {...model.form_props} />
      )
  }

}
ModelForm.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object,
  loading: PropTypes.bool,
  model: PropTypes.object.isRequired,
  getItem: PropTypes.func.isRequired,
  saveItem: PropTypes.func.isRequired
}

export default ModelWrap('model.item')(ModelForm)
