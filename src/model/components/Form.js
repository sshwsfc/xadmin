import React, { Component, PropTypes } from 'react'
import { Page, Icon } from '../../components'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Panel, Well, Button } from 'react-bootstrap'
import { ModelWrap } from '../base'
import XForm from '../../xform'
import utils from 'react-schema-form/lib/utils'

const ModelForm = React.createClass({

  propTypes: {
    id: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
    data: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    saveing: PropTypes.bool.isRequired,
    schema: PropTypes.object.isRequired,
    form: PropTypes.array.isRequired,
    getItem: PropTypes.func.isRequired,
    updateItem: PropTypes.func.isRequired
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
      record: { ...this.props.data },
      valid: false
    }
  },

  onModelChange(key, val) {
    utils.selectOrSet(key, this.state.record, val)
    const validationResult = utils.validateBySchema(this.props.schema, this.state.record)
    if(validationResult.valid != this.state.valid) {
      this.setState({ valid: validationResult.valid })
    }
  },

  submit() {
    const validationResult = utils.validateBySchema(this.props.schema, this.state.record)
    if(validationResult.valid) {
      this.props.updateItem(this.state.record)
    }
  },

  render() {
    const { schema, form, loading, saveing } = this.props
    const icon = saveing ? 'spinner fa-spin' : 'floppy-o'

    return (
      <Page title="Model Form">
      {loading ? 
        (<Panel><div className="text-center"><Icon name="spinner fa-spin fa-4x"/> Loading..</div></Panel>) : 
        (
          <div>
          <Panel>
            <XForm 
                schema={schema} 
                form={form} 
                model={this.state.record}
                onChange={this.onModelChange} />
          </Panel>
          <Well bsSize="small">
            <Button disabled={!this.state.valid || saveing} onClick={this.submit} bsStyle="primary">
              <Icon name={icon}/> Save</Button>
          </Well>
          </div>
        )
      }
      </Page>
    )
  }

})

export default ModelWrap('model.form')(ModelForm)
