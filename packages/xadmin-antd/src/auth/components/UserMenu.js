import React from 'react'
import { Menu } from 'antd'
import { Icon } from 'xadmin-ui'
import { StoreWrap, app, Block } from 'xadmin'
import { _t } from 'xadmin-i18n'

export default StoreWrap('auth.user')(({ user, onLogout, onChangePassword, ...props }) => 
  user && (
    <Block name="top.user.menu">
      {items => (
        <Menu.SubMenu key="user-dorpdown" {...props}
          title={<span className="submenu-title-wrapper"><Icon name="user" /> {user.username}</span>}>
          {items}
          <Menu.Item key={1} onClick={onChangePassword}>{_t('Change password')}</Menu.Item >
          <Menu.Item key={2} onClick={onLogout}>{_t('Logout')}</Menu.Item >
        </Menu.SubMenu>
      )}
    </Block>
  )
)
