import React from 'react'
import { Well, DropdownButton, MenuItem } from 'react-bootstrap'
import { Block } from '../../index'
import { ModelMixin } from '../base'


const ActionBar = React.createClass({
  mixins: [ModelMixin],

  getStateMap (storeState) {
    return {
      selected: storeState.selected
    }
  },

  render() {
    const selectedItems = this.state.selected
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

module.exports = ActionBar
