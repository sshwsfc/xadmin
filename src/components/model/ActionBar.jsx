import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Icon from '../Icon'
import { Well, DropdownButton, MenuItem } from 'react-bootstrap'
import { block } from '../../plugin'

const ActionBar = React.createClass({

  propTypes: {
    selected: React.PropTypes.array.isRequired
  },

  render() {
    const selectedItems = this.props.selected
      , count = selectedItems.length
    return (
      <Well bsSize="small">
        <DropdownButton title={ count > 0 ? `已选择 ${count} 条数据` : '未选择任何数据'} id="model-list-actions" bsStyle="success" dropup>
          <MenuItem eventKey="1">Dropdown link</MenuItem>
          <MenuItem eventKey="2">Dropdown link</MenuItem>
        </DropdownButton>
      </Well>
    )
  }
})

const stateMap = (state) => {
  return {
    selected: state.models$car$selected
  }
}

module.exports = connect(stateMap)(ActionBar)
