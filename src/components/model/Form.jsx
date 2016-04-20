import React from 'react'
import Page from '../Page'
import Icon from '../Icon'
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, Panel, Well, Button} from 'react-bootstrap'
import modelMixin from './base'
import XForm from '../../xform'
import utils from 'react-schema-form/lib/utils'

module.exports = React.createClass({

  mixins: [modelMixin],

  componentDidMount() {
    var model_id = this.props.params.id
    if(model_id){
      this.setState({loading: true})
      this.model.$res.get(model_id).then((data)=>{
        this.setState({model: data, loading: false})
      })
    } else {
      this.setState({loading: false})
    }
  },

  getInitialState() {
    return {
      model: {},
      error: '',
      valid: false,
      submitting: false,
      loading: true
    }
  },

  onModelChange(key, val) {
    utils.selectOrSet(key, this.state.model, val)
    let validationResult = utils.validateBySchema(this.model.schema, this.state.model)
    if(validationResult.valid != this.state.valid)
      this.setState({valid: validationResult.valid})
  },

  submit() {
    let model = this.model
    let validationResult = utils.validateBySchema(model.schema, this.state.model)
    if(validationResult.valid) {
      var data = this.state.model
      this.setState({submitting: true})
      model.$res.save(data).then((ret)=>{
        this.setState({submitting: false})
        this.context.router.push('/model/car/list')
      })
    }
  },

  render() {
    var model = this.model
    if(this.state.submitting) { 
      var icon = 'spinner fa-spin' 
    } else { 
      var icon = 'floppy-o' 
    }
    if(this.state.loading){
      var form = <Panel><div className="text-center"><Icon name="spinner fa-spin fa-4x"/> Loading..</div></Panel>
    } else {
      var form = (
        <div>
        <Panel>
          <XForm 
              schema={model.schema} 
              form={model.form} 
              model={this.state.model}
              onModelChange={this.onModelChange} />
        </Panel>
        <Well bsSize="small">
          <Button disabled={!this.state.valid || this.state.submitting} onClick={this.submit} bsStyle="primary">
            <Icon name={icon}/> Save</Button>
        </Well>
        </div>
        )
    }
    return (
      <Page title="Model Form">
        {form}
      </Page>
    )
  }

})
