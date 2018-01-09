import React from 'react'
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import Icon from 'react-fontawesome'
import { app, StoreWrap, Block } from 'xadmin-core'
import DashForm from './DashForm'
import DashboardWrap from '../../wrap'

export default DashboardWrap('dashboard.view')(React.createClass({

  addCell(type) {
    const Widget = app.load_dict('dashboard_widgets')[type]
    const { params: { editLayer } } = this.props
    const params = { 
      key: (Math.random() * 100).toString(), 
      params: {
        layer: editLayer,
        type,
        title: '未命名标题'
      },
      layout: { x: 0, y: 0, w: 4, h: 4 }
    }
    this.props.addCell(params)
    
    if(this.props.onAddCell) {
      this.props.onAddCell(params.key)
    }
  },

  changeLayer(editLayer) {
    const { params, saveParams } = this.props
    saveParams({
      ...params,
      editLayer
    })
  },

  render() {
    const { params: { layers, editLayer }, ...props } = this.props
    const widgets = app.load_dict('dashboard_widgets')
    return (
      <Nav {...props}>
        <NavDropdown eventKey="1" title="添加组件" id="nav-dropdown">
          {
            Object.keys(widgets).map(key => {
              const Widget = widgets[key]
              return <MenuItem eventKey={key} onSelect={()=>this.addCell(key)}>{Widget.Title}</MenuItem>
            })
          }
        </NavDropdown>
        <DashForm />
        <NavDropdown eventKey="3" title={editLayer == null || editLayer == undefined ? '选择图层' : `图层${editLayer+1}`} id="nav-dropdown">
          <MenuItem eventKey={'layer-null'} onSelect={()=>this.changeLayer(null)}>取消编辑</MenuItem>
          {
            layers && layers.map((layer, i) => {
              return <MenuItem eventKey={`layer-${i}`} active={editLayer == i} onSelect={()=>this.changeLayer(i)}>{`第${i+1}层`}</MenuItem>
            })
          }
        </NavDropdown>
        <NavItem onSelect={this.props.testData}><Icon name="bug"/> 随机数据</NavItem>
        {Block('dashboard.menu', this)}
      </Nav>
    )
  }

}))
