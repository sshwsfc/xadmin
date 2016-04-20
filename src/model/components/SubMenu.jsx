import React from 'react'
import { Link } from 'react-router'
import { Icon } from '../../components'
import { ButtonToolbar, ButtonGroup, Button, DropdownButton, MenuItem } from 'react-bootstrap'
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
      selected: storeState.filter.fields
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
      items.push(<MenuItem key={name} onClick={() => this.changeFieldDisplay(fieldName, !fieldSelected)}>{icon} {title}</MenuItem>)
    }
    return (
      <DropdownButton bsSize="small" title="显示列" pullRight={true} id="model-list-cols">
        {items}
      </DropdownButton>
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
