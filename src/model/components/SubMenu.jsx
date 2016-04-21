import React from 'react'
import { Link } from 'react-router'
import { Icon } from '../../components'
import { ButtonToolbar, OverlayTrigger, Popover, Clearfix, ButtonGroup, Button, Dropdown, MenuItem, Panel, ListGroup, ListGroupItem } from 'react-bootstrap'
import { block } from '../../plugin'
import { ModelMixin } from '../base'
import { changeField } from '../../model/actions'

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

  changeFieldDisplay (fieldName, select) {
    this.dispatch(changeField(fieldName, select))
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
        { block('model.list.submenu.btngroup', this) }

        <ButtonGroup bsSize="small">
          { block('model.list.submenu.btn', this) }
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
