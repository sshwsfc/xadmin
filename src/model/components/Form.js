import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { Page, Icon } from '../../components'
import { Navbar, Nav, NavItem, NavDropdown, OverlayTrigger, Tooltip, MenuItem, Panel, Well, Button } from 'react-bootstrap'
import { AutoAffix } from 'react-overlays'
import { ModelWrap } from '../base'
import { SchemaForm } from '../../form'
import { app } from '../../index'

const DefaultLayout = (props) => {
  const { children, invalid, handleSubmit, submitting } = props
  const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
  const { _t } = app.context
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>
      <Panel>{children}</Panel>
      <AutoAffix offsetBottom={20}>
      <Well bsSize="small" style={{ textAlign: 'right' }}>
      {invalid ? (
        <OverlayTrigger placement="top" overlay={<Tooltip>{_t('Please be sure to complete all field.')}</Tooltip>}>
          <Button type="submit" disabled={submitting} onClick={handleSubmit} bsStyle="primary">
            <Icon name="ban"/> {_t('Save')}</Button>
        </OverlayTrigger>
        ) : (
          <Button type="submit" disabled={submitting} onClick={handleSubmit} bsStyle="primary">
            <Icon name={icon}/> {_t('Save')}</Button>
        )}
      </Well>
      </AutoAffix>
    </form>
  )
}

const ModelForm = React.createClass({

  propTypes: {
    id: PropTypes.string,
    data: PropTypes.object,
    loading: PropTypes.bool,
    model: PropTypes.object.isRequired,
    getItem: PropTypes.func.isRequired,
    saveItem: PropTypes.func.isRequired
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.setState({ record: _.omitBy({ ...nextProps.data }, _.isNil) })
    }
    if (this.props.id !== nextProps.id) {
      this.props.getItem(nextProps.id)
    }
  },

  getInitialState() {
    return {
      record: _.omitBy({ ...this.props.data }, _.isNil)
    }
  },

  render() {
    const { title, model, loading, saveItem, componentClass, ...formProps } = this.props
    const FormLayout = componentClass || DefaultLayout
    return loading ? 
      (<Panel><div className="text-center"><Icon name="spinner fa-spin fa-4x"/></div></Panel>) : 
      (<SchemaForm 
        formKey={`model.${model.key}`}
        schema={model}
        initialValues={this.state.record}
        onSubmit={saveItem}
        component={FormLayout}
        {...formProps}
        {...model.form_props} />
      )
  }

})

export default ModelWrap('model.item')(ModelForm)
