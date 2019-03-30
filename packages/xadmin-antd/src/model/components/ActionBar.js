import React from 'react'
import _ from 'lodash'
import { Dropdown, Button, Menu, Icon } from 'antd'
import { app } from 'xadmin'
import { ModelWrap, ModelBlock } from 'xadmin-model'

@ModelWrap('model.list.actions')
class ActionBar extends React.Component {

  render() {
    const count = this.props.count
    const { _t } = app.context

    return (
      <ModelBlock name="model.list.actions" el={this}>
        { actions => actions && (
          <Dropdown id="model-list-actions" overlay={(
            <Menu>
              { React.Children.toArray(actions) }
            </Menu>
          )}>
            <Button>
              { count > 0 ? _t('{{count}} record selected', { count }) : _t('No data selected')} <Icon type="down" />
            </Button>
          </Dropdown>
        ) }
      </ModelBlock>
    )
  }
}

export default ActionBar
