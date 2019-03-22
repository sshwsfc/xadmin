import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { DropdownButton, ButtonToolbar, MenuItem } from 'react-bootstrap'
import { app } from 'xadmin'
import { ModelWrap, ModelBlock } from 'xadmin-model'

class ActionBar extends React.Component {

  render() {
    const count = this.props.count
    const { _t } = app.context

    return (
      <ModelBlock name="model.list.actions" el={this}>
        { actions => actions && (
          <DropdownButton className="mb-3" title={ count > 0 ? _t('{{count}} record selected', { count }) : _t('No data selected')} id="model-list-actions" variant="success" drop="up">
            { React.Children.toArray(actions) }
          </DropdownButton>
        ) }
      </ModelBlock>
    )
  }
}

ActionBar.propTypes = {
  count: PropTypes.number.isRequired
}

export default ModelWrap('model.list.actions')(ActionBar)
