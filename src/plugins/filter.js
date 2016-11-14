import React from 'react'
import _ from 'lodash'
import { Nav, NavItem, NavDropdown, MenuItem, OverlayTrigger, Popover, Button } from 'react-bootstrap'
import filterManager from './filters'
import { ModelWrap } from '../model/base'
import { SchemaForm } from '../form'

const FilterNav = ModelWrap('mode.list.filter')(React.createClass({

  propTypes: {
    parent: React.PropTypes.object
  },

  renderFilter() {
    let model = this.context.model
      , filters = model.filters || []
    return filters.map(filter => {
      let field = model.properties[filter]
        , title = field.title || _.capitalize(filter)
        , FilterComponent = filterManager.create(field, filter)
      return <FilterComponent key={`${model.name}-${filter}`} context={this.props.parent} field={field} filter={filter} />
    })
  },

  render() {
    const { schema, title, formKey, loading, updateItem } = this.props

    const FormLayout = (props) => {
      const { children, invalid, handleSubmit, submitting } = props
      return (
        <form className="form-horizontal">
          {children}
          <Button disabled={invalid || submitting} onClick={handleSubmit} bsStyle="primary">Search</Button>
        </form>
      )
    }

    return (
      <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={
        <Popover>
          <SchemaForm
            formKey={formKey}
            schema={schema}
            component={FormLayout}
            />
        </Popover>}>
        <NavItem>Filter</NavItem>
      </OverlayTrigger>)
  }

}))

export default {
  blocks: {
    'model.list.nav': () => <FilterNav />
  },
  mappers: {
    'mode.list.filter': {
      compute: ({ model, modelState }) => {
        return {
          filters: model.filters || [],
          formKey: `filter.${model.name}`,
          schema: model
        }
      }
    }
  }
}
