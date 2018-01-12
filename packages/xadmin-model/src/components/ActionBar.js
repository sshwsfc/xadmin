import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Well, DropdownButton, ButtonToolbar, MenuItem } from 'react-bootstrap'
import { Block, app } from 'xadmin'
import { ModelWrap } from '../base'

class ActionBar extends React.Component {

  render() {
    const count = this.props.count
    const { _t } = app.context
    const actions = Block('model.list.actions', this)
    
    return actions ? (
      <Well bsSize="small">
        <ButtonToolbar>
          <DropdownButton title={ count > 0 ? _t('{{count}} record selected', { count }) : _t('No data selected')} id="model-list-actions" bsStyle="success" dropup>
            { React.Children.toArray(actions) }
          </DropdownButton>
        </ButtonToolbar>
      </Well>
    ) : null
  }
}

ActionBar.propTypes = {
  count: PropTypes.number.isRequired
}

export default ModelWrap('model.list.actions')(ActionBar)
