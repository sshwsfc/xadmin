import React from 'react'
import _ from 'lodash'
import { Field, reduxForm, reducer as formReducer } from 'redux-form'
import Icon from 'react-fontawesome'
import app from 'xadmin-core'
import { Nav, ButtonGroup, Panel, Modal, Navbar, NavItem, NavDropdown, MenuItem, OverlayTrigger, Popover, Badge, Button, Col, Row, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap'
import { BaseForm } from 'xadmin-form'
import { InlineGroup, SimpleGroup } from 'xadmin-form/lib/components/base'

import { ModelWrap } from '../index'
import filter_converter from './filters'
import filter_fields from './fields'

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
    const { _t } = app.context
    const { filters, formKey, data, changeFilter, resetFilter } = this.props
    const FormLayout = (props) => {
      const { children, invalid, pristine, handleSubmit, submitting } = props
      return (
        <form className="form-horizontal" onSubmit={handleSubmit}>
          {children}
          <Row>
            <Col sm={9} xsOffset={3} >
              <Button disabled={invalid || pristine || submitting} onClick={handleSubmit} bsStyle="primary">{_t('Search')}</Button>
              {' '}
              <Button disabled={submitting} onClick={resetFilter} bsStyle="default">{_t('Clear')}</Button>
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
    const { _t } = app.context
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
            <Button disabled={invalid || pristine || submitting} bsSize="sm" onClick={handleSubmit} bsStyle="primary">{_t('Search')}</Button>
            {' '}
            <Button disabled={submitting} onClick={resetFilter} bsSize="sm" bsStyle="default">{_t('Clear')}</Button>
            </Col>
          </Row>
        </form>
      )
    }
    const groupComponent = ({ id, label, help, error, groupProps, children }) => {
      return (
        <Col key={0} sm={6} md={4}>
          <FormGroup controlId={id} {...groupProps}>
          <Row>
            <Col key={0} componentClass={ControlLabel} sm={2} md={5}>
              {label}
            </Col>
            <Col key={1} sm={10} md={7}>
              {children}
              <FormControl.Feedback />
              {help && <HelpBlock>{help}</HelpBlock>}
              {error && <HelpBlock>{error}</HelpBlock>}
            </Col>
          </Row>
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
              group={groupComponent}
              fieldProps={{ attrs: { bsSize: 'sm' }, mode: 'mini' }}
            />)
  }

})

const FilterMenu = ModelWrap('model.list.filter')(React.createClass({

  render() {
    const { _t } = app.context
    const { filters, formKey, data, changeFilter, resetFilter } = this.props

    if(filters && filters.length) {
      const FormLayout = (props) => {
        const { children, invalid, pristine, handleSubmit, submitting } = props
        return (
          <Panel>
            <Panel.Heading>{_t('Filter Form')}</Panel.Heading>
            <Panel.Body>
              <form onSubmit={handleSubmit}>
                {children}
                <ButtonGroup justified>
                  <Button style={{ width: '30%' }} disabled={submitting} onClick={resetFilter} bsStyle="default">{_t('Clear')}</Button>
                  <Button style={{ width: '70%' }} disabled={invalid || pristine || submitting} onClick={handleSubmit} bsStyle="primary">{_t('Search')}</Button>
                </ButtonGroup>
              </form>
            </Panel.Body>
          </Panel>
        )
      }

      return (<FilterForm
              formKey={formKey}
              filters={filters}
              component={FormLayout}
              initialValues={data}
              onSubmit={changeFilter}
              group={SimpleGroup}
            />)
    } else {
      return null
    }
  }

}))

const FilterPopover = ModelWrap('model.list.filter')(React.createClass({

  render() {
    const { _t } = app.context
    const { filters, data } = this.props
    if(filters && filters.length) {
      return (
        <OverlayTrigger trigger="click" rootClose={false} placement="bottom" overlay={
          <Popover style={{ maxWidth: 580 }}>
            <FilterDiv {...this.props}/>
          </Popover>}>
          <NavItem><Icon name="filter" /> {_t('Filter')} {(data && Object.keys(data).length) ? (<Badge>{Object.keys(data).length}</Badge>) : null}</NavItem>
        </OverlayTrigger>)
    } else {
      return null
    }
  }

}))

const FilterModal = ModelWrap('model.list.filter')(React.createClass({

  getInitialState() {
    return { show: false }
  },

  showModal() {
    this.setState({ show: true })
  },

  onClose() {
    this.setState({ show: false })
  },

  renderFilterForm() {
    const { _t } = app.context
    const { filters, formKey, data, changeFilter, resetFilter } = this.props
    const FormLayout = (props) => {
      const { children, invalid, pristine, handleSubmit, submitting } = props
      return (
        <form className="form-horizontal" onSubmit={handleSubmit}>
          <Modal.Body>
            {children}
          </Modal.Body>
          <Modal.Footer>
            <Button disabled={submitting} onClick={()=>{
              resetFilter()
              this.onClose()
            }} bsStyle="default">{_t('Clear')}</Button>
            <Button disabled={invalid || pristine || submitting} onClick={()=>{
              handleSubmit()
              this.onClose()
            }} bsStyle="primary">{_t('Search')}</Button>
          </Modal.Footer>
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
  },

  renderModal() {
    const { _t } = app.context
    return (
      <Modal show={this.state.show} onHide={this.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{_t('Filter Form')}</Modal.Title>
        </Modal.Header>
        {this.renderFilterForm()}
      </Modal>
    )
  },

  render() {
    const { _t } = app.context
    const { filters, data } = this.props
    if(filters && filters.length) {
      return (
          <NavItem onClick={this.showModal}>
            <Icon name="filter" /> {_t('Filter')} {(data && Object.keys(data).length) ? (<Badge>{Object.keys(data).length}</Badge>) : null}
            {this.state.show ? this.renderModal() : null}
          </NavItem>
        )
    } else {
      return null
    }
  }

}))

const FilterSubMenu = ModelWrap('model.list.filter')(React.createClass({
  render() {
    const { filters } = this.props
    return filters && filters.length ? (<Panel><Panel.Body><FilterInline {...this.props}/></Panel.Body></Panel>) : null
  }
}))

const FilterNavForm = ModelWrap('model.list.filter')(React.createClass({

  renderFilterForm() {
    const { _t } = app.context
    const { filters, formKey, data, changeFilter, resetFilter } = this.props
    const FormLayout = (props) => {
      const { children, invalid, pristine, handleSubmit, submitting } = props
      return (
        <Navbar.Form pullRight onSubmit={handleSubmit}>
          {children}{' '}
          <Button disabled={invalid || pristine || submitting} onClick={handleSubmit} bsStyle="primary">{_t('Search')}</Button>
          {' '}
          <Button disabled={submitting} onClick={resetFilter} bsStyle="default">{_t('Clear')}</Button>
        </Navbar.Form>
      )
    }
    return (<FilterForm
              formKey={formKey}
              filters={filters}
              component={FormLayout}
              initialValues={data}
              onSubmit={changeFilter}
              group={InlineGroup}
              fieldProps={{ mode: 'base' }}
            />)
  },

  render() {
    const { filters } = this.props
    if(filters && filters.length) {
      return this.renderFilterForm()
    } else {
      return null
    }
  }

}))

const block_func = (Filter, name) => ({ model }) => (
  (model && model.filters && model.filters[name]) ? <Filter name={name} /> : null
)

export default {
  name: 'xadmin.filter',
  blocks: {
    'model.list.nav': () => [ <FilterModal name="nav" />, <FilterNavForm name="navform" /> ],
    'model.list.modal': block_func(FilterModal, 'modal'),
    'model.list.popover': block_func(FilterPopover, 'popover'),
    'model.list.submenu': block_func(FilterSubMenu, 'submenu'),
    'model.list.sidemenu': block_func(FilterMenu, 'sidemenu')
  },
  mappers: {
    'model.list.filter': {
      data: ({ model, modelState }, { name }) => {
        return {
          data: modelState.wheres.filters
        }
      },
      compute: ({ model, modelState }, { data, name }) => {
        const filters = (model.filters ? (model.filters[name] || []) : []).map(filter => {
          const key = typeof filter == 'string' ? filter : filter.key
          return {
            key,
            schema: model.properties[key],
            field: typeof filter == 'string' ? { } : filter
          }
        })
        return {
          filters, data: _.clone(data),
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
const FilterNav = FilterModal
export {
  FilterForm,
  FilterSubMenu,
  FilterPopover,
  FilterNavForm,
  FilterMenu,
  FilterModal,
  FilterNav
}
