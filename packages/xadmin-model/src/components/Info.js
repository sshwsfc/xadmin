import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import Icon from 'react-fontawesome'
import { StoreWrap, app } from 'xadmin-core'
import { convert as schemaConvert } from 'xadmin-form/lib/schema'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Panel, Well, ButtonFormGroup, HelpBlock, FormGroup, Col, FormControl, ControlLabel } from 'react-bootstrap'

import { ModelWrap } from '../base'
import { Item } from './items'

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

  if (attrs.bsSize) {
    groupProps['bsSize'] = attrs.bsSize
  }
  if (attrs.bsStyle) {
    groupProps['bsStyle'] = attrs.bsStyle
  }

  const controlComponent = children ? children : (<FormControl {...attrs} />)
  
  return (
    <FormGroup {...groupProps}>
      <Col key={0} componentClass={ControlLabel} {...size.label}>
        {label}
      </Col>
      <Col key={1} {...size.control}>
        {controlComponent}
        <FormControl.Feedback />
        {help && <HelpBlock>{help}</HelpBlock>}
      </Col>
    </FormGroup>
    )
}


const ModelInfo = React.createClass({

  propTypes: {
    id: PropTypes.string,
    data: PropTypes.object,
    loading: PropTypes.bool,
    model: PropTypes.object.isRequired,
    getItem: PropTypes.func.isRequired
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

  rednerFields() {
    const { title, model, ...formProps } = this.props
    const record = this.state.record

    return schemaConvert(model).fields.map(field => {
      field.option = { ...field.option, ...formProps }
      return (
        <FieldGroup label={field.label} field={field}>
          <Item item={record} field={field.key} selected={false} wrap={
              ({ children, ...props })=><FormControl.Static>{children}</FormControl.Static>
            }/>
        </FieldGroup>)
    })
  },

  render() {
    const { title, model, loading, componentClass, ...formProps } = this.props

    return loading ? 
      (<Panel><div className="text-center"><Icon name="spinner fa-spin fa-4x"/></div></Panel>) : 
      (<form className="form-horizontal">
        <Panel>{this.rednerFields()}</Panel>
      </form>)
  }

})

export default ModelWrap('model.item')(ModelInfo)
