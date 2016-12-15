import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { Page, Icon } from '../../components'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Panel, Well, Button } from 'react-bootstrap'
import { ModelWrap } from '../base'
import { SchemaForm } from '../../form'

const ModelForm = React.createClass({

  propTypes: {
    id: PropTypes.string,
    data: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    schema: PropTypes.object.isRequired,
    key: PropTypes.string.isRequired,
    getItem: PropTypes.func.isRequired,
    updateItem: PropTypes.func.isRequired
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
    const { title, model, loading, updateItem, ...formProps } = this.props
    const FormLayout = (props) => {
      const { children, invalid, handleSubmit, submitting } = props
      const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
      return (
        <form className="form-horizontal">
          <Panel>{children}</Panel>
          <Well bsSize="small">
            <Button disabled={invalid || submitting} onClick={handleSubmit} bsStyle="primary">
              <Icon name={icon}/> Save</Button>
          </Well>
        </form>
      )
    }
    return loading ? 
      (<Panel><div className="text-center"><Icon name="spinner fa-spin fa-4x"/></div></Panel>) : 
      (<SchemaForm 
        formKey={`model.${model.key}`}
        schema={model}
        initialValues={this.state.record}
        onSubmit={updateItem}
        component={FormLayout}
        {...formProps} />
      )
  }

})

export default ModelWrap('model.item')(ModelForm)
