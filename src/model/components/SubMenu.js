import React from 'react'
import _ from 'lodash'
import { Link } from 'react-router'
import { Icon } from '../../components'
import { ButtonToolbar, OverlayTrigger, Popover, Clearfix, ButtonGroup, Button, Dropdown, MenuItem, Panel, ListGroup, ListGroupItem } from 'react-bootstrap'
import { Block } from '../../index'
import { ModelWrap } from '../base'

const CountButton = ModelWrap('model.list.btn.count')(React.createClass({
  propTypes: {
    count: React.PropTypes.number.isRequired
  },

  render() {
    return <Button bsSize="small">{this.props.count} record</Button>
  }
}))

const ColsDropdown = ModelWrap('model.list.btn.cols')(React.createClass({

  propTypes: {
    selected: React.PropTypes.array.isRequired,
    fields: React.PropTypes.object.isRequired,
    changeFieldDisplay: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return { open: false }
  },

  render() {
    const { selected, fields } = this.props
    let items = []
    for (let name in fields) {
      let field = fields[name]
        , fieldName = name
        , title = field.title || name
        , fieldSelected = _.indexOf(selected, name) !== -1
        , icon = fieldSelected ? <Icon name="check-square-o" /> : <Icon name="square-o" />
      items.push(<ListGroupItem key={name} onClick={(e) => {
        this.props.changeFieldDisplay([ fieldName, !fieldSelected ])
      }}>{icon} {title}</ListGroupItem>)
    }

    const DropdownBtn = Dropdown.ControlledComponent
    return (
      <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={
        <Popover id="model-cols-select-popover">
          <ListGroup fill style={{ marginBottom: 0 }}>
            {items}
          </ListGroup>
        </Popover>
      }>
        <Button bsSize="small">Columns</Button>
      </OverlayTrigger>
      )
  }
}))

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

export default SubMenu
