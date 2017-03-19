import React from 'react'
import _ from 'lodash'
import { Well, DropdownButton, ButtonToolbar, MenuItem } from 'react-bootstrap'
import { Block, app } from '../../index'
import { ModelWrap } from '../base'


const ActionBar = React.createClass({
  propTypes: {
    count: React.PropTypes.number.isRequired
  },

  render() {
    const count = this.props.count
    const { _t } = app.context
    const actions = Block('model.list.actions', this)
    return (actions !== undefined && _.isArray(actions) && actions.filter(act=>!_.isNil(act)).length>0) ? (
      <Well bsSize="small">
        <ButtonToolbar>
          <DropdownButton title={ count > 0 ? _t('{{count}} record selected', { count }) : _t('No data selected')} id="model-list-actions" bsStyle="success" dropup>
            { actions }
          </DropdownButton>
        </ButtonToolbar>
      </Well>
    ) : null
  }
})

export default ModelWrap('model.list.actions')(ActionBar)
