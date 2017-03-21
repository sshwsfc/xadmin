import React from 'react'
import _ from 'lodash'
import { Field, reduxForm, reducer as formReducer } from 'redux-form'
import { Nav, Well, NavItem, NavDropdown, MenuItem, OverlayTrigger, Popover, Badge, Button, Col, Row, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap'
import { ModelWrap } from '../model/base'
import { BaseForm } from '../form'
import filter_converter from './filters'
import filter_fields from './fields'
import { app } from '../index'
import { Icon } from '../components'

const convert = (schema, options) => {
  const opts = options || {}
  return app.load_list('filter_converter').reduce((prve, converter) => {
    return converter(prve, schema, opts)
  }, {})
}

const FilterForm = (props) => {
  const { formKey, filters, fieldProps } = props
  const fields = filters.map(filter => {
    const field = convert(filter.schema, { key: filter.key })
    return _.merge(field, filter.field, fieldProps)
  })
  const WrapForm = reduxForm({ 
    form: formKey
  })(BaseForm)
  return <WrapForm fields={fields} {...props}/>
}

const FilterDiv = React.createClass({

  render() {
    const { filters, formKey, data, changeFilter, resetFilter } = this.props
    const FormLayout = (props) => {
      const { children, invalid, pristine, handleSubmit, submitting } = props
      return (
        <form className="form-horizontal" onSubmit={handleSubmit}>
          {children}
          <Row>
            <Col sm={9} xsOffset={3} >
              <Button disabled={invalid || pristine || submitting} onClick={handleSubmit} bsStyle="primary">Search</Button>
              {' '}
              <Button disabled={submitting} onClick={resetFilter} bsStyle="default">Clear</Button>
            </Col>
          </Row>
        </form>
      )
    }
    return (<FilterForm
              formKey={formKey}
              filters={filters}
              component={FormLayout}
              initialValues={data}
              onSubmit={changeFilter}
              fieldProps={{ mode: 'base' }}
            />)
  }

})

const FilterInline = React.createClass({

  render() {
    const { filters, formKey, data, changeFilter, resetFilter } = this.props

    const FormLayout = (props) => {
      const { children, invalid, pristine, handleSubmit, submitting } = props
      return (
        <form className="form-horizontal" onSubmit={handleSubmit}>
          <Row style={{ marginBottom: '-5px' }}>
          {children}
          </Row>
          <Row>
            <Col style={{ textAlign: 'center' }} sm={12}>
            <Button disabled={invalid || pristine || submitting} bsSize="sm" onClick={handleSubmit} bsStyle="primary">Search</Button>
            {' '}
            <Button disabled={submitting} onClick={resetFilter} bsSize="sm" bsStyle="default">Clear</Button>
            </Col>
          </Row>
        </form>
      )
    }
    const groupComponent = ({ id, label, help, error, groupProps, children }) => {
      return (
          <Col key={0} sm={6}>
            <FormGroup controlId={id} {...groupProps}>
              <Col key={0} componentClass={ControlLabel} sm={2}>
                {label}
              </Col>
              <Col key={1} sm={10}>
                {children}
                <FormControl.Feedback />
                {help && <HelpBlock>{help}</HelpBlock>}
                {error && <HelpBlock>{error}</HelpBlock>}
              </Col>
            </FormGroup>
          </Col>
      )
    }
    return (<FilterForm
              formKey={formKey}
              filters={filters}
              component={FormLayout}
              initialValues={data}
              onSubmit={changeFilter}
              fieldProps={{ attrs: { bsSize: 'sm', groupComponent }, mode: 'mini' }}
            />)
  }

})

const FilterMenu = ModelWrap('model.list.filter')(React.createClass({

  render() {
    const { filters, formKey, data, changeFilter, resetFilter } = this.props

    const FormLayout = (props) => {
      const { children, invalid, pristine, handleSubmit, submitting } = props
      return (
        <form className="form-horizontal" onSubmit={handleSubmit}>
          {children}
          <Button disabled={invalid || pristine || submitting} onClick={handleSubmit} bsStyle="primary">Search</Button>
          {' '}
          <Button disabled={submitting} onClick={resetFilter} bsStyle="default">Clear</Button>
        </form>
      )
    }
    const groupComponent = ({ id, label, help, error, groupProps, children }) => {
      return (
        <div>
          <h5>{label}</h5>
          {children}
        </div>
      )
    }

    return (<FilterForm
            formKey={formKey}
            filters={filters}
            component={FormLayout}
            initialValues={data}
            onSubmit={changeFilter}
            fieldProps={{ attrs: { groupComponent }, mode: 'base' }}
          />)
  }

}))

const FilterNav = ModelWrap('model.list.filter')(React.createClass({

  render() {
    const { filters, data } = this.props
    if(filters && filters.length) {
      return (
        <OverlayTrigger trigger="click" rootClose={false} placement="bottom" overlay={
          <Popover style={{ maxWidth: 580 }}>
            <FilterDiv {...this.props}/>
          </Popover>}>
          <NavItem><Icon name="filter" /> Filter {(data && Object.keys(data).length) ? (<Badge>{Object.keys(data).length}</Badge>) : null}</NavItem>
        </OverlayTrigger>)
    } else {
      return null
    }
  }

}))

const FilterSubMenu = ModelWrap('model.list.filter')(React.createClass({
  render() {
    const { filters } = this.props
    return filters && filters.length ? (<Well><FilterInline {...this.props}/></Well>) : null
  }
}))

export default {
  FilterSubMenu,
  FilterNav,
  FilterMenu,
  app: {
    name: 'xadmin.filter',
    blocks: {
      'model.list.nav': () => <FilterNav name="nav" />,
      'model.list.submenu': () => <FilterSubMenu name="submenu" />,
      'model.list.sidemenu': () => <FilterMenu name="sidemenu" />
    },
    mappers: {
      'model.list.filter': {
        data: ({ model, modelState }, { name }) => {
          return {
            data: modelState.wheres.filters
          }
        },
        compute: ({ model, modelState }, { name }) => {
          const filters = (model.filters ? (model.filters[name] || []) : []).map(filter => {
            const key = typeof filter == 'string' ? filter : filter.key
            return {
              key,
              schema: model.properties[key],
              field: typeof filter == 'string' ? { } : filter
            }
          })
          return {
            filters,
            formKey: `filter.${model.name}`
          }
        },
        method: {
          resetFilter: ({ dispatch, model, modelState }) => (e) => {
            dispatch({ model, type: 'GET_ITEMS', filter: { ...modelState.filter, skip: 0 }, wheres: _.omit(modelState.wheres, 'filters') })
          },
          changeFilter: ({ dispatch, model, modelState }, { name }) => (values) => {
            const where = Object.keys(values).reduce((prev, key) => {
              if(values[key]) {
                prev[key] = values[key]
              } else {
                prev = _.omit(prev, key)
              }
              return prev
            }, { ...modelState.wheres.filters })
            const wheres = (Object.keys(where).length > 0 ? 
              { ...modelState.wheres, filters: where } : _.omit(modelState.wheres, 'filters'))
            dispatch({ model, type: 'GET_ITEMS', filter: { ...modelState.filter, skip: 0 }, wheres })
          }
        }
      }
    },
    form_fields: filter_fields,
    filter_converter
  }
}
