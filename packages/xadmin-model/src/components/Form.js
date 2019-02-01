import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Icon from 'react-fontawesome'
import app from 'xadmin'
import { Page, Loading } from 'xadmin-layout'
import { SchemaForm } from 'xadmin-form'

import { Navbar, Nav, NavItem, NavDropdown, OverlayTrigger, Tooltip, MenuItem, Panel, Well, Button } from 'react-bootstrap'
import { ModelWrap } from '../base'

const DefaultLayout = (props) => {
  const { children, invalid, handleSubmit, submitting } = props
  const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
  const { _t } = app.context
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>
      <Panel><Panel.Body>{children}</Panel.Body></Panel>
      <Well bsSize="small" style={{ textAlign: 'right' }}>
        <Button onClick={()=>history.back()} bsStyle="default">{_t('Cancel')}</Button>{' '}
        {invalid ? (
          <OverlayTrigger placement="top" overlay={<Tooltip>{_t('Please be sure to complete all field')}</Tooltip>}>
            <Button type="submit" disabled={submitting} onClick={handleSubmit} bsStyle="primary">
              <Icon name="ban"/> {_t('Save')}</Button>
          </OverlayTrigger>
        ) : (
          <Button type="submit" disabled={submitting} onClick={handleSubmit} bsStyle="primary">
            <Icon name={icon}/> {_t('Save')}</Button>
        )}
      </Well>
    </form>
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
