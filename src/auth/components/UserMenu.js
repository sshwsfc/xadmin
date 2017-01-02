import React from 'react'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import { StoreWrap } from '../../index'
import Icon from '../../components/Icon'
import { app } from '../../index'

const UserMenu = StoreWrap('auth.user')(({ user, onLogout }) => {
  const { _t } = app.context
  return user && (
    <NavDropdown eventKey={0} 
      title={<span><Icon name="user" /> {user.username}</span>} id="basic-nav-dropdown">
      <MenuItem eventKey={0.1} onSelect={onLogout}>{_t('Logout')}</MenuItem>
    </NavDropdown>
  )
})

export default UserMenu
