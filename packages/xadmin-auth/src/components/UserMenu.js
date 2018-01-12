import React from 'react'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'

import Icon from 'react-fontawesome'
import { StoreWrap, app, Block } from 'xadmin'

const UserMenu = StoreWrap('auth.user')(({ user, onLogout, onChangePassword }) => {
  const { _t } = app.context
  return user && (
    <NavDropdown eventKey={0} 
      title={<span><Icon name="user" /> {user.username}</span>} id="basic-nav-dropdown">
      { Block('top.user.menu', this) }
      <MenuItem eventKey={0.1} onSelect={onChangePassword}>{_t('Change password')}</MenuItem>
      <MenuItem eventKey={0.2} onSelect={onLogout}>{_t('Logout')}</MenuItem>
    </NavDropdown>
  )
})

export default UserMenu
