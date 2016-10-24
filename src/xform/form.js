import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Nav, NavItem } from 'react-bootstrap'
import { FormGroup, ControlLabel, FormControl, Col, HelpBlock, Panel, Button } from 'react-bootstrap'

class SchemaForm extends React.Component {
  
  render() {
    let merged = utils.merge(this.props.schema, this.props.form, this.props.ignore, this.props.option)
    // console.log('SchemaForm merged = ', JSON.stringify(merged, undefined, 2));
    let mapper = this.mapper
    if (this.props.mapper) {
      mapper = _.merge(this.mapper, this.props.mapper)
    }
    let forms = merged.map(function (form) {
      return this.builder(form, this.props.model, this.onChange, mapper)
    }.bind(this))

    return (
      <form className="form-horizontal">{forms}</form>
    )
  }
  
}
