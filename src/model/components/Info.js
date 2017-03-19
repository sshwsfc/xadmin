import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { Page, Icon } from '../../components'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Panel, Well, Button } from 'react-bootstrap'

import { StoreWrap, app } from '../index'
import { ModelWrap } from '../base'
import { convert as schemaConvert } from '../form/schema'

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
      const FieldComponent = field.component
      return <FieldComponent />
    })
  },

  render() {
    const { title, model, loading, componentClass, ...formProps } = this.props

    return loading ? 
      (<Panel><div className="text-center"><Icon name="spinner fa-spin fa-4x"/></div></Panel>) : 
      (
      <form className="form-horizontal">
        <Panel>{this.rednerFields()}</Panel>
      </form>
      )
  }

})

export default ModelWrap('model.item')(ModelInfo)
