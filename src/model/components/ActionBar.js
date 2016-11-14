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
        <DropdownButton title={ count > 0 ? `Selected ${count} count data` : 'No Data Selected'} id="model-list-actions" bsStyle="success" dropup>
          { Block('model.list.actions', this) }
        </DropdownButton>
      </Well>
    )
  }
})

export default ModelWrap('model.list.actions')(ActionBar)
