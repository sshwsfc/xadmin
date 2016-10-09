import React from 'react'
import _ from 'lodash'
import { Nav, NavItem, NavDropdown, MenuItem, OverlayTrigger, Popover, Button } from 'react-bootstrap'
import filterManager from './filters'

const FilterNav = React.createClass({

  propTypes: {
    context: React.PropTypes.object
  },

  renderFilter() {
    let ctx = this.props.context
      , model = ctx.model
      , filters = model.filters || []
    return filters.map(filter => {
      let field = model.schema.properties[filter]
        , title = field.title || _.capitalize(filter)
        , FilterComponent = filterManager.create(field, filter)
      return <FilterComponent key={`${model.name}-${filter}`} context={ctx} field={field} filter={filter} />
    })
  },

  render() {
    return (
      <NavDropdown eventKey={1} title="Filter" id="basic-nav-dropdown">
        {this.renderFilter()}
      </NavDropdown>)
  }

})

export default {
  blocks: {
    'model.list.nav': FilterNav
  }
}
