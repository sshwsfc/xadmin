import React from 'react'
import { Menu, Icon } from 'antd'

const NavItem = ({ itemKey, onSelect, children, icon, title, ...props }) => (
  <Menu.Item key={itemKey} {...props}>
    <a onClick={onSelect}>
      {icon} <span className="nav-text">{title || children}</span>
    </a>
  </Menu.Item>
)

export {
  NavItem
}
