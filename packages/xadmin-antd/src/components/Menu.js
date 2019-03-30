import React from 'react'
import { Menu } from 'antd'

const MenuItem = ({ itemKey, onItemClick, children, icon, title, ...props }) => (
  <Menu.Item key={itemKey} {...props} onClick={e => {
    props.onClick(e)
    onItemClick && onItemClick(e)
  }}>
    {icon} <span className="nav-text">{children}</span>
  </Menu.Item>
)

export {
  Menu,
  MenuItem
}
