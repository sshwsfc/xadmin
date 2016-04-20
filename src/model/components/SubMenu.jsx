import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Icon } from '../../components'
import { ButtonToolbar, ButtonGroup, Button, DropdownButton, MenuItem } from 'react-bootstrap'
import { block } from '../../plugin'

const CountButton = connect(state => {
  return {
    count: state.count
  }
})(React.createClass({
  propTypes: {
    count: React.PropTypes.number.isRequired
  },
  render() {
    return <Button bsSize="small">共{this.props.count}条记录</Button>
  }
}))

const SubMenu = React.createClass({

  propTypes: {
  },

  render() {
    return (
      <ButtonToolbar className="pull-right">
        <CountButton />
        { block('model.list.submenu.btngroup', this) }

        <ButtonGroup bsSize="small">
          { block('model.list.submenu.btn', this) }
        </ButtonGroup>

        <DropdownButton bsSize="small" title="显示列" id="model-list-cols">
          <MenuItem eventKey="1">Dropdown link</MenuItem>
          <MenuItem eventKey="2">Dropdown link</MenuItem>
        </DropdownButton>

        <ButtonGroup bsSize="small">
          <Button><Icon name="arrows-alt" /></Button>
        </ButtonGroup>
      </ButtonToolbar>
    )
  }
})

const stateMap = (state) => {
  return {
  }
}

module.exports = connect(stateMap)(SubMenu)
