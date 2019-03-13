import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { DropdownButton, ButtonToolbar, MenuItem } from 'react-bootstrap'
import { Block, app } from 'xadmin'
import { ModelWrap } from '../base'

class ActionBar extends React.Component {

  render() {
    const count = this.props.count
    const { _t } = app.context

    return (
      <Block name="model.list.actions" {...this.props}>
        { actions => actions && (
          <DropdownButton className="mb-2" title={ count > 0 ? _t('{{count}} record selected', { count }) : _t('No data selected')} id="model-list-actions" variant="success" drop="up">
            { React.Children.toArray(actions) }
          </DropdownButton>
        ) }
      </Block>
    )
  }
}

ActionBar.propTypes = {
  count: PropTypes.number.isRequired
}

export default ModelWrap('model.list.actions')(ActionBar)
