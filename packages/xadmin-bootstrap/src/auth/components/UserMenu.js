import React from 'react'
import { NavDropdown } from 'react-bootstrap'

import Icon from 'react-fontawesome'
import { StoreWrap, app, Block } from 'xadmin'

const UserMenu = StoreWrap('auth.user')(({ user, onLogout, onChangePassword }) => {
  const { _t } = app.context
  return user && (
    <NavDropdown key="user-dorpdown" alignRight
      title={<span><Icon name="user" /> {user.username}</span>} id="basic-nav-dropdown">
      <Block name="top.user.menu" el={this} />
      <NavDropdown.Item key={1}  eventKey={1} onSelect={onChangePassword}>{_t('Change password')}</NavDropdown.Item >
      <NavDropdown.Item key={2} eventKey={2} onSelect={onLogout}>{_t('Logout')}</NavDropdown.Item >
    </NavDropdown>
  )
})

export default UserMenu
