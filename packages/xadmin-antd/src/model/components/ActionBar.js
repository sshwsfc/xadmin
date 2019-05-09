import React from 'react'
import _ from 'lodash'
import { Dropdown, Button, Menu, Icon } from 'antd'
import { app, use } from 'xadmin'
import { _t } from 'xadmin-i18n'
import { ModelBlock } from 'xadmin-model'

export default props => {
  const { count } = use('model.actions', props)

  return (
    <ModelBlock name="model.list.actions">
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
