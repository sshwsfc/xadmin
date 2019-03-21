import React from 'react'
import { Menu } from 'antd'

const MenuItem = ({ itemKey, onClick, children, icon, title, ...props }) => (
  <Menu.Item key={itemKey} {...props}>
    <a onClick={onClick}>
      {icon} <span className="nav-text">{children}</span>
    </a>
  </Menu.Item>
)

export {
  Menu,
  MenuItem
}
