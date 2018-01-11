import React, { Component, PropTypes } from 'react'
import Icon from 'react-fontawesome'
import { Page } from 'xadmin-layout'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Panel, Well, Button } from 'react-bootstrap'
import { ModelWrap } from '../base'

const ModelDetail = React.createClass({

  propTypes: {
    id: PropTypes.string,
    title: React.PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
    data: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    schema: PropTypes.object.isRequired,
    getItem: PropTypes.func.isRequired
  },

  componentDidMount() {
    this.props.getItem(this.props.id)
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.setState({ record: { ...nextProps.data } })
    }
    if (this.props.id !== nextProps.id) {
      this.props.getItem(nextProps.id)
    }
  },

  getInitialState() {
    return {
      record: { ...this.props.data }
    }
  },

  render() {
    const { schema, title, formKey, loading } = this.props
    return (
      <Page title={title}>
      {loading ? 
        (<Panel><Panel.Body><div className="text-center"><Icon name="spinner fa-spin fa-4x"/> Loading..</div></Panel.Body></Panel>) : 
        (<Panel><Panel.Body>{}</Panel.Body></Panel>)
      }
      </Page>
    )
  }

})

export default ModelWrap('model.detail')(ModelDetail)
