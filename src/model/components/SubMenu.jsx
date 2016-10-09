import React from 'react'
import _ from 'lodash'
import { Link } from 'react-router'
import { Icon } from '../../components'
import { ButtonToolbar, OverlayTrigger, Popover, Clearfix, ButtonGroup, Button, Dropdown, MenuItem, Panel, ListGroup, ListGroupItem } from 'react-bootstrap'
import { Block } from '../../index'
import { ModelMixin } from '../base'

const CountButton = React.createClass({
  mixins: [ModelMixin],

  getStateMap (storeState) {
    return {
      count: storeState.count
    }
  },

  render() {
    return <Button bsSize="small">共{this.state.count}条记录</Button>
  }
})

const ColsDropdown = React.createClass({
  mixins: [ModelMixin],

  getStateMap (storeState) {
    return {
      selected: storeState.filter.fields,
      open: false
    }
  },

  changeFieldDisplay (field, select) {
    const filter = this.getModelState().filter
    const fields = [].concat(filter.fields || [])
    const index = _.indexOf(fields, field)
    if (select) {
      if (index === -1) fields.push(field)
    } else {
      _.remove(fields, (i) => { return i === field })
    }
    this.dispatch({ type: 'GET_ITEMS', filter: { ...filter, fields }})
  },

  render() {
    const fields = this.model.schema.properties
    const selected = this.state.selected
    let items = []
    for (let name in fields) {
      let field = fields[name]
        , fieldName = name
        , title = field.title || name
        , fieldSelected = _.indexOf(selected, name) !== -1
        , icon = fieldSelected ? <Icon name="check-square-o" /> : <Icon name="square-o" />
      items.push(<ListGroupItem key={name} onClick={(e) => {
        this.changeFieldDisplay(fieldName, !fieldSelected)
      }}>{icon} {title}</ListGroupItem>)
    }

    const DropdownBtn = Dropdown.ControlledComponent
    return (
      <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={
        <Popover id="model-cols-select-popover">
          <ListGroup fill style={{marginBottom: 0}}>
            {items}
          </ListGroup>
        </Popover>
      }>
        <Button bsSize="small">显示列</Button>
      </OverlayTrigger>
      )
  }
})

const SubMenu = React.createClass({

  render() {
    return (
      <ButtonToolbar className="pull-right">
        <CountButton />
        { Block('model.list.submenu.btngroup', this) }

        <ButtonGroup bsSize="small">
          { Block('model.list.submenu.btn', this) }
        </ButtonGroup>

        <ColsDropdown />

        <ButtonGroup bsSize="small">
          <Button><Icon name="arrows-alt" /></Button>
        </ButtonGroup>
      </ButtonToolbar>
    )
  }
})

module.exports = SubMenu
