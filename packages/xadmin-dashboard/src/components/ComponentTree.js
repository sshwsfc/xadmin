import React from 'react'
import DashboardWrap from '../wrap'
import { Icon, Tabs, Button, Tree, Card } from 'antd'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'
import { app } from 'xadmin'
import Root from './Root'

const TabPane = Tabs.TabPane
const TreeNode = Tree.TreeNode

@DashboardWrap('dashboard.cell')
class NodeTitle extends React.Component {
  render() {
    const { cellKey, title, removeCell, copyCell } = this.props
    return (
      <div>
        <ContextMenuTrigger id={`tree-node-${cellKey}`} holdToDisplay={-1}>
          {title}
        </ContextMenuTrigger>
        <ContextMenu id={`tree-node-${cellKey}`}>
          <MenuItem onClick={(e)=>copyCell(cellKey)}>
            复制
          </MenuItem>
          <MenuItem onClick={(e)=>removeCell(cellKey)}>
            删除
          </MenuItem>
        </ContextMenu>
      </div>
    )
  }
}

@DashboardWrap('dashboard.view')
export default class ComponentTree extends React.Component {

  onDragEnter = (info) => {
  }

  onSelect = (selectedKeys, info) => {
    selectedKeys && this.props.selectCell(selectedKeys[0])
  }

  onDrop = (info) => {
    const dropKey = info.node.props.eventKey
    const dragKey = info.dragNode.props.eventKey
    const dropPos = info.node.props.pos.split('-')
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
    this.props.moveCell({ info, dropKey, dragKey, dropPos, dropPosition })
  }
  // ContextMenu
  ContextMenuhandleClick = (e,key) => {
    alert('删除'+key+'成功')
  }
  render() {
    const { cells, selectedCell } = this.props
    const widgets = app.load_dict('dashboard_widgets')

    const Node = ( nodeName ) => {
      return (cells[nodeName] && cells[nodeName].childrenCells || []).map(key =>{
        const cell = cells[key]
        const children = Node(key)
        const Widget = widgets[cell.type] || {}
        const title = (cell.name ? <span>{cell.name} <span style={{ fontSize: '0.6em', color: '#BBB' }}>[{Widget.Title}]</span></span> : Widget.Title)
        const cellTitle = <NodeTitle cellKey={key} title={title} />
        if(children && children.length > 0) {
          return (
            <TreeNode title={cellTitle} key={key}>
              { children }
            </TreeNode>
          )
        } else {
          return <TreeNode title={cellTitle} key={key} />
        }
      })
    }

    return (
      <Tree
        showLine
        defaultExpandAll={true}
        onSelect={this.onSelect}
        selectedKeys={selectedCell ? [ selectedCell ] : []}
        draggable
        onDragEnter={this.onDragEnter}
        onDrop={this.onDrop}
        className="draggable-tree">
        <TreeNode title={<span>根节点 <span style={{ fontSize: '0.6em', color: '#BBB' }}>[{Root.getWidget().Title}]</span></span>} key={Root.key}>
          { Node(Root.key) }
        </TreeNode>
      </Tree>
    )
  }
}
