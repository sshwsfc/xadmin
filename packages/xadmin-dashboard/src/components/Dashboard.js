import React, { Component, PropTypes } from 'react'
import { app, StoreWrap } from 'xadmin'
import Cell from './Cell'
import DashboardWrap from '../wrap'
import Root from './Root'

const Dashboard = DashboardWrap('dashboard.view')(React.createClass({

  renderContent() {
    const { params, scale, cells, editMode=true } = this.props
    const { background='transparent', height=1080, width='auto' } = params
    const childrenCells = Object.keys(cells).filter(key => cells[key].parent == Root.key)
    
    const style = { position: 'relative', height, width, background }
    if(!editMode) {
      style['overflow'] = 'hidden'
    }
    if(scale) {
      style['transform'] = 'scale('+ scale +')'
    }
    const Main = Root.getWidget()

    return <Main className="dashboard" editMode={editMode} style={style} cellKey={Root.key} childrenCells={childrenCells} />
  },

  render() {
    const { height=1080, width='auto' } = this.props.params
    return (
      <div className="dashboard" style={{ width, height, margin: '0 auto' }}>
        {this.renderContent()}
      </div>
    )
  }

}))

export default Dashboard
