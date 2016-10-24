import { reducer as formReducer } from 'redux-form'
import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Nav, NavItem } from 'react-bootstrap'
import { FormGroup, ControlLabel, FormControl, Col, HelpBlock, Panel, Button } from 'react-bootstrap'
import { StoreWrap } from '../index'

const xform = (key) => (component) => {
  return StoreWrap(key)(reduxForm({ form: key })(component))
}

class ContactForm extends Component {
  field(name) {
    return ({ input, label, meta: { touched, error }, ...custom }) => {
      return (
        <FormGroup controlId={`formContorl${name}`}>
          <Col componentClass={ControlLabel} sm={2}>
            {label}
          </Col>
          <Col sm={10}>
            <FormControl
              {...input}
              {...custom} />
              <FormControl.Feedback />
              {error && <HelpBlock>{error}</HelpBlock>}
          </Col>
        </FormGroup>
      )
    }
  }
  render() {
    const { handleSubmit } = this.props
    return (
      <form onSubmit={handleSubmit} className="form-horizontal">
        <div>
          <label htmlFor="firstName">First Name</label>
          <Field name="firstName" component={this.field('first_name')} type="text"/>
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <Field name="lastName" component={this.field('last_name')} type="text"/>
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <Field name="email" component={this.field('email')} type="email"/>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    )
  }
}

export default {
  blocks: app => {
    return {
      main_menu: () => (<NavItem onSelect={()=>{app.context.router.push('/testform')}}> TestForm</NavItem>)
    }
  },
  reducers: {
    form: formReducer
  },
  routers: {
    '/': [ {
      path: 'testform',
      component: xform('model.carr.form')(ContactForm)
    } ]
  },
  mappers: {
    'model.carr.form': {
      method: {
        handleSubmit: ({ dispatch }) => (data) => {
          console.log(data)
          return false
        }
      }
    }
  }
}
