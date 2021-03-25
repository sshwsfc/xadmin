import React from 'react'
import _ from 'lodash'
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Button, Menu } from 'antd';
import { app, use } from 'xadmin'
import { _t } from 'xadmin-i18n'

export default props => {
  const { model } = use('model', props)
  const { count } = use('model.select', props)
  const { renderActions } = use('model.batchActions', props)
  const actions = renderActions({ ...props, model })
  return actions && actions.length > 0 ? (
    <Dropdown id="model-list-actions" overlay={(
      <Menu>
        { React.Children.toArray(actions) }
      </Menu>
    )}>
      <Button>
        { count > 0 ? _t('{{count}} record selected', { count }) : _t('No data selected')} <DownOutlined />
      </Button>
    </Dropdown>
  ) : <div></div>;
}
