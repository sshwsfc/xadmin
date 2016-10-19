import React from 'react'
import { Well, DropdownButton } from 'react-bootstrap'
import { Block } from '../../index'
import { ModelWrap } from '../base'


const ActionBar = React.createClass({
  propTypes: {
    count: React.PropTypes.number.isRequired
  },

  render() {
    const count = this.props.count
    return (
      <Well bsSize="small">
        <DropdownButton title={ count > 0 ? `已选择 ${count} 条数据` : '未选择任何数据'} id="model-list-actions" bsStyle="success" dropup>
          { Block('model.list.actions', this) }
        </DropdownButton>
      </Well>
    )
  }
})

module.exports = ModelWrap('model.list.actions')(ActionBar)
